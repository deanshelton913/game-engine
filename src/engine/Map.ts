import { LegendItem } from './LegendItem';
import { Legend } from './Legend';
import { Coordinate } from './Coordinate';
import { MovementSpeed } from './MovementSpeed';
import { Size } from './Size';
import { Velocity } from './Velocity';

class MapConfiguiration {
  constructor(
    public movementSpeed: MovementSpeed,
    public pSize: Size = new Size(100, 100),
    public velocityLimit: Coordinate,
    public rawMapData: Array<Array<number>>,
    public size: Size,
    public gravity: Velocity,
    public background?: string,
    public tileSize?: number,
  ) {}
}

export class Map {
  static DEFAULT_TILE = Legend[0];
  public data: Array<Array<LegendItem>>;
  public pSize: Size = new Size(100, 100);
  public velocityLimit: Coordinate;
  public rawMapData: Array<Array<number>>;
  public size: Size;
  public background?: string;
  public tileSize?: number;
  public gravity: Velocity;
  public movementSpeed: MovementSpeed;
  
  static Load(config: MapConfiguiration): Map {
    const parsedMapData = Map.lookupMapDataInLegend(config.rawMapData);
    const map = new Map(config);
    map.setData(parsedMapData);
    return map;
  }

  static lookupMapDataInLegend(rawMapData: Array<Array<number>>) {
    let parsedMapData: Array<Array<LegendItem>> = [[]];

    rawMapData.forEach((row, y) => {
      row.forEach((column, x) => {
        const id = rawMapData[y][x];
        parsedMapData[y][x] = Legend[id];
      });
    });
    return parsedMapData;
  }

  constructor(public config: MapConfiguiration) {
    this.pSize = config.pSize;
    this.velocityLimit = config.velocityLimit;
    this.rawMapData = config.rawMapData;
    this.size = config.size;
    this.background = config.background;
    this.tileSize = config.tileSize;
    this.gravity = config.gravity;
    this.movementSpeed = config.movementSpeed;
  }
  
  setData(data: Array<Array<LegendItem>>) {
    this.data = data;
  }
}