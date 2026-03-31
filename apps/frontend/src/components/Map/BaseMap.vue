<template>
  <l-map ref="map" v-model:zoom="zoom" :center="center" :use-center-zoom-until-ready="true" :use-global-leaflet="true">

    <template v-if="view === Types.View.SATELITE">
      <l-tile-layer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        layer-type="base" name="Satelite" />

      <l-tile-layer url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png" layer-type="overlay"
        :z-index="10" />
    </template>

    <l-tile-layer v-else-if="view === Types.View.ROADMAP"
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
      layer-type="base" name="Roadmap" />


    <l-geo-json :key="props.transactionType" :geojson="geoJsonData" :options="geoJsonOptions"></l-geo-json>

    <l-marker v-if="clickMarker" :lat-lng="clickMarker" draggable @moveend="onClickMarkerDragged" />

  </l-map>
</template>

<script setup lang="js">
const props = defineProps({
  accuracy: {
    type: String,
    default: () => Types.Accuracy.APPROXIMATE
  },
  // the marker that appears when map is clicked or searched
  clickMarker: {
    type: Array, //lat-lng or [number, number]
    default: null
  },
  center: {
    type: Array, //lat-lng or [number, number]
    default: () => [14.5833, 121.0500]
  },
  isRecenter: {
    type: Boolean, 
    default: () => false
  },
  view: {
    type: String,
    default: () => Types.View.SATELITE
  },
  transactionType: {
    type: String, 
    default: () => Types.TransactionType.SALE
  },
})

const emit = defineEmits({
  clickMarkerDragged: (center) => {
    if (Array.isArray(center) && center.length === 2) {
      return true;
    } else {
      console.warn('Invalid payload emitted for clickMarkerDragged!');
      return false;
    }
  }
});


import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker, LGeoJson } from "@vue-leaflet/vue-leaflet";
import { nextTick, ref, watch } from "vue";
import L from 'leaflet';
import { Types } from "./types";
import rawGeoJsonData from "@/assets/map/geo.json"

const zoom = ref(10);
const map = ref(null);

const geoJsonData = ref(rawGeoJsonData);
const geoJsonOptions = {
  pointToLayer: (feature, lat_lng) => {
    const transactionType = feature.properties?.transactionType.toLowerCase();
    if (transactionType !== props.transactionType) {
      return;
    }

    const { name, price, id } = feature.properties;
    const propertyType = feature.properties?.propertyType?.toLowerCase();

    let circle;
    if (props.accuracy === Types.Accuracy.APPROXIMATE) {
      circle = L.circle(lat_lng, {
        radius: 500,
      });
    }

    const icon = Types.ICON_MAP[propertyType]
      ?? Types.ICON_MAP['default'];

    const marker = L.marker(lat_lng, { icon });
    marker.bindTooltip(
      `<div style="font-family: sans-serif;"
      <strong>${name}</strong><br />
      <strong>${id}</strong> (${propertyType})<br />
        ₱${price} ${transactionType === Types.TransactionType.RENT}
      </div>`, {
      permanent: false,
    });

    const layers = [circle, marker].filter(layer => !!layer)
    return L.layerGroup(layers);
  }
};

watch(
  [() => props.isRecenter],
  async ([]) => {
    await nextTick();
    recenter();
  }
)

async function recenter() {
  const leafletInstance = map.value?.leafletObject;

  if (leafletInstance) {
    leafletInstance.flyTo(props.center, zoom.value, {
      animate: true,
      duration: .5,
    })
  }
}

const onClickMarkerDragged = (event) => {
  const lat_lng = event.target.getLatLng();
  const newCenter = [lat_lng.lat, lat_lng.lng];

  emit('clickMarkerDragged', newCenter);
}
</script>
