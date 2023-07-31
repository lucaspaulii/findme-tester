<script lang="ts">
/*eslint-disable no-undef*/
import { Loader } from "@googlemaps/js-api-loader";
import { Ref, onMounted, ref } from "vue";

export default {
  name: "Map",
  props: ["Coords"],
  data() {
    return {
      coords: {
        lat: this.Coords.latitude,
        lng: this.Coords.longitude,
      },
    };
  },
  setup(props) {
    const loader = new Loader({
      apiKey: "AIzaSyAxuQ_SZyPpdHnxsQKvz6iU81Y8WPQFAys",
      version: "weekly",
      libraries: ["places"],
    });
    const mapDiv: Ref<null | HTMLElement> = ref(null);
    let map: google.maps.Map;
    let marker: google.maps.Marker;
    let coords = ref({
      lat: props.Coords.latitude,
      lng: props.Coords.longitude,
    });

    onMounted(async () => {
      loader
        .load()
        .then((google) => {
          map = new google.maps.Map(mapDiv.value as HTMLElement, {
            center: { lat: coords.value.lat, lng: coords.value.lng },
            zoom: 19,
            mapTypeId: "satellite",
            tilt: 0,
            draggable: true,
            streetViewControl: false,
            zoomControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            rotateControl: false,
          });
          marker = new google.maps.Marker({
            position: {
              lat: coords.value.lat,
              lng: coords.value.lng,
            },
            map: map,
          });
        })
        .catch(() => {console.log(marker)});
    });
    return { mapDiv };
  },
  watch: {
    coords: function (newValue) {
      console.log(newValue);
    },
  },
};
</script>

<template>
  <div ref="mapDiv" :key="1" style="width: 50%; height: 50%"></div>
</template>
