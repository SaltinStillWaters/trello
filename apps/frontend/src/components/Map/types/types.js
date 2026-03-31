import condoIconPath from "@/assets/Map/markers/condo.png";
import houseIconPath from "@/assets/Map/markers/house.png";
import defaultIconPath from "@/assets/Map/markers/default.png";
import L from 'leaflet';

export const View = {
  SATELITE: 'satelite',
  ROADMAP: 'roadmap'
};

export const PropertyType = {
  CONDO: 'condo',
  HOUSE: 'house',
  DEFAULT: 'default',
};

export const Accuracy = {
  APPROXIMATE: 'approximate',
  PRECISE: 'precise',
};

export const TransactionType = {
  RENT: 'rent',
  SALE: 'sale',
};

export const ICON_MAP = {
  [PropertyType.CONDO]: L.icon({
    iconUrl: condoIconPath,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  }),
  [PropertyType.HOUSE]: L.icon({
    iconUrl: houseIconPath,
    iconSize: [48, 48],
    iconAnchor: [24, 24]
  }),
  [PropertyType.DEFAULT]: L.icon({
    iconUrl: defaultIconPath,
    iconSize: [24, 38],
    iconAnchor: [12, 38]
  }),
};