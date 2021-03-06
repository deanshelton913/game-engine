import { Coordinate } from './Coordinate';
import { Velocity } from './Velocity';
import { Size } from './Size';
import { KeyboardSignals } from './KeyboardSignals';
import { Player } from './Player';
import { Map, MapConfiguration } from './Map';
import { LegendItem } from './LegendItem';
import { Scripts } from './Scripts';
import { Legend } from './Legend';

export class EngineConfiguration {
    constructor(
        public alertErrors: boolean,
        public logInfo: boolean,
        public tileSize: number,
        public limitViewport: boolean,
        public jumpSwitch: number,
        public viewport: Size,
        public camera: Coordinate,
        public key: { left: boolean; right: boolean; up: boolean },
        public player: Player,
    ) { }
}

export class Engine {
    config: EngineConfiguration;
    currentMap: Map;
    mapSize: Size;
    private lastTile: LegendItem;

    constructor(config: EngineConfiguration) {
        this.config = config;
        window.onkeydown = this.keyDown;
        window.onkeyup = this.keyUp;
    }

    keyDown = (e: KeyboardEvent) => {
        if (e.keyCode === KeyboardSignals.UP) { this.config.key.up = true; }
        if (e.keyCode === KeyboardSignals.LEFT) { this.config.key.left = true; }
        if (e.keyCode === KeyboardSignals.RIGHT) { this.config.key.right = true; }
        // if (e.keyCode === KeyboardSignals.DOWN) { this.key.down = true; }
    }

    keyUp = (e: KeyboardEvent) => {
        if (e.keyCode === KeyboardSignals.UP) { this.config.key.up = false; }
        if (e.keyCode === KeyboardSignals.LEFT) { this.config.key.left = false; }
        if (e.keyCode === KeyboardSignals.RIGHT) { this.config.key.right = false; }
        // if (e.keyCode === KeyboardSignals.DOWN) { this.key.down = false; }
    }

    error(message: string) {
        if (this.config.alertErrors) { window.alert(message); }
        // if (this.config.logInfo) { LOGGER(message); };
    }

    setViewport(newSize: Size) {
        this.config.viewport = newSize;
    }

    loadMap(rawMapData: Array<Array<number>>): Map {
        const { data, size } = this.lookupMapDataInLegend(rawMapData); // TODO: this is gross
        const movementSpeed = { jump: 6, left: 0.3, right: 0.3 };
        const pSize = new Size(
            size.x * this.config.tileSize,
            size.y * this.config.tileSize
        );
        const velocityLimit = new Velocity(2, 16);
        const gravity = new Velocity(0, 0.3);
        const background = '#333';
        const tileSize = 16;

        const mapConfiguration = new MapConfiguration(
            movementSpeed,
            pSize,
            velocityLimit,
            rawMapData,
            size,
            gravity,
            background,
            tileSize
        );
        const map = new Map(mapConfiguration);
        map.setData(data);
        this.currentMap = map;
        return map;
    }

    lookupMapDataInLegend(rawMapData: Array<Array<number>>) {
        let parsedMapData: LegendItem[][];
        let sizeY = 0;
        let sizeX = 0;
        parsedMapData = [];
        rawMapData.forEach((row, y) => {
            sizeY = Math.max(sizeY, y);
            parsedMapData[y] = [];
            row.forEach((column, x) => {
                sizeX = Math.max(sizeX, x);
                parsedMapData[y][x] = Legend[rawMapData[y][x]];
            });
        });
        return { data: parsedMapData, size: new Size(sizeX, sizeY) }; // gross
    }

    getTile(coorinate: Coordinate) {
        if (this.currentMap.data[coorinate.y] && this.currentMap.data[coorinate.y][coorinate.x]) {
            return this.currentMap.data[coorinate.y][coorinate.x];
        }
        return Map.DEFAULT_TILE;
    }

    drawTile(coordinate: Coordinate, tile: LegendItem, context: CanvasRenderingContext2D) {
        if (!tile || !tile.colour) { return; }
        context.fillStyle = tile.colour;
        context.fillRect(coordinate.x, coordinate.y, this.config.tileSize, this.config.tileSize);
    }

    drawMap(context: CanvasRenderingContext2D, fore: boolean) {
        for (var y = 0; y < this.currentMap.data.length; y++) {

            for (var x = 0; x < this.currentMap.data[y].length; x++) {

                if ((!fore && !this.currentMap.data[y][x].fore) || (fore && this.currentMap.data[y][x].fore)) {

                    var tx = (x * this.config.tileSize) - this.config.camera.x;
                    var ty = (y * this.config.tileSize) - this.config.camera.y;

                    if (tx < -this.config.tileSize
                        || ty < -this.config.tileSize
                        || tx > this.config.viewport.x
                        || ty > this.config.viewport.y) { continue; }

                    this.drawTile(
                        new Coordinate(tx, ty),
                        this.currentMap.data[y][x],
                        context
                    );
                }
            }
        }

        if (!fore) { this.drawMap(context, true); }
    }

    movePlayer() {
        var tX = this.config.player.location.x + this.config.player.velocity.x;
        var tY = this.config.player.location.y + this.config.player.velocity.y;

        var offset = Math.round((this.config.tileSize / 2) - 1);

        var tile = this.getTile(
            new Coordinate(
                Math.round(this.config.player.location.x / this.config.tileSize), // x
                Math.round(this.config.player.location.y / this.config.tileSize) // y
            )
        );

        if (tile.gravity) {

            this.config.player.velocity.x += tile.gravity.x;
            this.config.player.velocity.y += tile.gravity.y;

        } else {

            this.config.player.velocity.x += this.currentMap.gravity.x;
            this.config.player.velocity.y += this.currentMap.gravity.y;
        }

        if (tile.friction) {

            this.config.player.velocity.x *= tile.friction.x;
            this.config.player.velocity.y *= tile.friction.y;
        }

        var tyUp = Math.floor(tY / this.config.tileSize);
        var tyDown = Math.ceil(tY / this.config.tileSize);
        var yNear1 = Math.round((this.config.player.location.y - offset) / this.config.tileSize);
        var yNear2 = Math.round((this.config.player.location.y + offset) / this.config.tileSize);

        var txLeft = Math.floor(tX / this.config.tileSize);
        var txRight = Math.ceil(tX / this.config.tileSize);
        var xNear1 = Math.round((this.config.player.location.x - offset) / this.config.tileSize);
        var xNear2 = Math.round((this.config.player.location.x + offset) / this.config.tileSize);

        var top1 = this.getTile(new Coordinate(xNear1, tyUp));
        var top2 = this.getTile(new Coordinate(xNear2, tyUp));
        var bottom1 = this.getTile(new Coordinate(xNear1, tyDown));
        var bottom2 = this.getTile(new Coordinate(xNear2, tyDown));
        var left1 = this.getTile(new Coordinate(txLeft, yNear1));
        var left2 = this.getTile(new Coordinate(txLeft, yNear2));
        var right1 = this.getTile(new Coordinate(txRight, yNear1));
        var right2 = this.getTile(new Coordinate(txRight, yNear2));

        if (tile.jump && this.config.jumpSwitch > 15) {

            this.config.player.canJump = true;

            this.config.jumpSwitch = 0;

        } else {
            this.config.jumpSwitch++;
        }

        const playerVelocityX = Math.max(this.config.player.velocity.x, -this.currentMap.velocityLimit.x);
        const playerVelocityY = Math.max(this.config.player.velocity.y, -this.currentMap.velocityLimit.y);

        this.config.player.velocity.x = Math.min(playerVelocityX, this.currentMap.velocityLimit.x);
        this.config.player.velocity.y = Math.min(playerVelocityY, this.currentMap.velocityLimit.y);

        this.config.player.location.x += this.config.player.velocity.x;
        this.config.player.location.y += this.config.player.velocity.y;

        this.config.player.velocity.x *= .9;

        if (left1.solid || left2.solid || right1.solid || right2.solid) {

            /* fix overlap */
            while (this.getTile(new Coordinate(
                Math.floor(this.config.player.location.x / this.config.tileSize),
                yNear1
            )).solid || this.getTile(new Coordinate(
                Math.floor(this.config.player.location.x / this.config.tileSize),
                yNear2
            )).solid) {
                this.config.player.location.x += 0.1;
            }

            while (this.getTile(new Coordinate(
                Math.ceil(this.config.player.location.x / this.config.tileSize),
                yNear1
            )).solid || this.getTile(new Coordinate(
                Math.ceil(this.config.player.location.x / this.config.tileSize),
                yNear2
            )).solid) {
                this.config.player.location.x -= 0.1;
            }

            /* tile bounce */

            let bounce = 0;

            if (left1.solid && left1.bounce > bounce) { bounce = left1.bounce; }
            if (left2.solid && left2.bounce > bounce) { bounce = left2.bounce; }
            if (right1.solid && right1.bounce > bounce) { bounce = right1.bounce; }
            if (right2.solid && right2.bounce > bounce) { bounce = right2.bounce; }

            this.config.player.velocity.x *= -bounce || 0;

        }

        if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {

            /* fix overlap */
            while (this.getTile(new Coordinate(
                xNear1,
                Math.floor(this.config.player.location.y / this.config.tileSize)
            )).solid || this.getTile(new Coordinate(
                xNear2,
                Math.floor(this.config.player.location.y / this.config.tileSize)
            )).solid) {
                this.config.player.location.y += 0.1;
            }

            while (this.getTile(new Coordinate(
                xNear1,
                Math.ceil(this.config.player.location.y / this.config.tileSize)
            )).solid || this.getTile(new Coordinate(
                xNear2,
                Math.ceil(this.config.player.location.y / this.config.tileSize)
            )).solid) {
                this.config.player.location.y -= 0.1;
            }
            /* tile bounce */

            let bounce = 0;

            if (top1.solid && top1.bounce > bounce) { bounce = top1.bounce; }
            if (top2.solid && top2.bounce > bounce) { bounce = top2.bounce; }
            if (bottom1.solid && bottom1.bounce > bounce) { bounce = bottom1.bounce; }
            if (bottom2.solid && bottom2.bounce > bounce) { bounce = bottom2.bounce; }

            this.config.player.velocity.y *= -bounce || 0;

            if ((bottom1.solid || bottom2.solid) && !tile.jump) {

                this.config.player.onFloor = true;
                this.config.player.canJump = true;
            }

        }

        // adjust camera

        var camX = Math.round(this.config.player.location.x - this.config.viewport.x / 2);
        var camY = Math.round(this.config.player.location.y - this.config.viewport.y / 2);
        var absDiffX = Math.abs(camX - this.config.camera.x);
        var absDiffY = Math.abs(camY - this.config.camera.y);

        if (absDiffX > 5) {

            let mag = Math.round(Math.max(1, absDiffX * 0.1));

            if (camX !== this.config.camera.x) {

                this.config.camera.x += camX > this.config.camera.x ? mag : -mag;

                if (this.config.limitViewport) {

                    this.config.camera.x =
                        Math.min(
                            this.currentMap.pSize.x - this.config.viewport.x + this.config.tileSize,
                            this.config.camera.x
                        );

                    this.config.camera.x =
                        Math.max(
                            0,
                            this.config.camera.x
                        );
                }
            }
        }

        if (absDiffY > 5) {

            let mag = Math.round(Math.max(1, absDiffY * 0.1));

            if (camY !== this.config.camera.y) {

                this.config.camera.y += camY > this.config.camera.y ? mag : -mag;

                if (this.config.limitViewport) {

                    this.config.camera.y =
                        Math.min(
                            this.currentMap.pSize.y - this.config.viewport.y + this.config.tileSize,
                            this.config.camera.y
                        );

                    this.config.camera.y =
                        Math.max(
                            0,
                            this.config.camera.y
                        );
                }
            }
        }
        if ((this.lastTile && this.lastTile.id !== tile.id) && tile.script) {
            // tslint:disable-next-line:no-eval
            eval(Scripts[tile.script]);
        }

        this.lastTile = tile;
    }

    updatePlayer() {

        if (this.config.key.left) {

            if (this.config.player.velocity.x > -this.currentMap.velocityLimit.x) {
                this.config.player.velocity.x -= this.currentMap.movementSpeed.left;
            }
        }

        if (this.config.key.up) {
            if (this.config.player.canJump && this.config.player.velocity.y > -this.currentMap.velocityLimit.y) {
                this.config.player.velocity.y -= this.currentMap.movementSpeed.jump;
                this.config.player.canJump = false;
            }
        }

        if (this.config.key.right) {

            if (this.config.player.velocity.x < this.currentMap.velocityLimit.x) {
                this.config.player.velocity.x += this.currentMap.movementSpeed.left;
            }
        }

        this.movePlayer();
    }

    drawPlayer(context: CanvasRenderingContext2D) {
        context.fillStyle = this.config.player.color;
        context.beginPath();
        context.arc(
            this.config.player.location.x + this.config.tileSize / 2 - this.config.camera.x,
            this.config.player.location.y + this.config.tileSize / 2 - this.config.camera.y,
            this.config.tileSize / 2 - 1,
            0,
            Math.PI * 2
        );
        context.fill();
    }

    update() {
        this.updatePlayer();
    }

    draw(context: CanvasRenderingContext2D) {
        this.drawMap(context, false);
        this.drawPlayer(context);
    }
}