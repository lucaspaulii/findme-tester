<script setup lang="ts">
import { ref, Ref } from "vue";
import postRequest, { RequestObj, RequestResponse } from "./services/postRequest";
import getRequest from "./services/getRequests";
import codes from "country-calling-code";
import Map from "./components/Map.vue";

components: {
  Map;
}

const reqObject: Ref<RequestObj> = ref({
  providerId: "0",
  email: "",
  country: "",
  phone: "",
  requestIdentifier: "",
  notificationSMS: false,
});

const coords : Ref<any>  = ref(undefined);

const postResponse : Ref<RequestResponse | undefined>  = ref(undefined);

const getResponse : Ref<any> = ref(undefined);

const countryCode = ref("55");

const isWaiting: Ref<Boolean> = ref(false);

async function handleSubmit(e: Event) {
  e.preventDefault();
  reqObject.value.phone = `+${countryCode.value + reqObject.value.phone}`;
  if (!reqObject.value.requestIdentifier) {
    delete reqObject.value.requestIdentifier;
  } else if (!reqObject.value.providerId) {
    reqObject.value.providerId = "0";
  }

  isWaiting.value = true;
  const request = await postRequest(reqObject.value);
  postResponse.value = request;
  if (request) {
    console.log(request);
    const locationObj = await getRequest(request.id);
    getResponse.value = locationObj;
    coords.value = {
      latitude: locationObj.coordinates[1],
      longitude: locationObj.coordinates[0],
    };
    console.log(locationObj);
  }
}
</script>

<template>
  <div
    class="w-screen h-screen bg-gradient-to-b from-green-300 to-blue-100 flex flex-col justify-center items-center font-montserrat"
  >
    <h1 class="text-4xl font-extrabold text-black pb-5">FindMe Tester</h1>
    <form
      @submit="handleSubmit"
      v-if="!coords"
      class="flex flex-col gap-4 p-6 bg-slate-600 bg-opacity-50 rounded-lg items-center shadow-lg shadow-[#00000050]"
    >
      <div class="flex flex-col bg-white p-1 w-full rounded">
        <p class="font-light text-gray-500">Provider:</p>
        <div class="flex w-full justify-around p-1">
          <div class="flex gap-1">
            <input
              type="radio"
              name="provider"
              id="default"
              checked
              value="0"
              v-model="reqObject.providerId"
            />
            <label for="default">Default (PT)</label>
          </div>
          <div class="flex gap-1">
            <input
              type="radio"
              name="provider"
              id="vivo"
              value="300"
              v-model="reqObject.providerId"
            />
            <label for="vivo">Vivo (EN)</label>
          </div>
        </div>
      </div>
      <input
        type="email"
        name="email"
        v-model="reqObject.email"
        placeholder="Your E-mail"
        class="p-2 w-full rounded bg-white"
        required
      />
      <select
        name="country"
        v-model="reqObject.country"
        class="w-full p-2 rounded bg-white"
        required
      >
        <option selected="true" :value="''" hidden disabled>
          Client's Country
        </option>
        <option v-for="code in codes" :value="code.isoCode2">
          {{ code.country }}
        </option>
      </select>
      <div class="flex gap-1">
        <select
          name="countryCode"
          v-model="countryCode"
          class="w-24 text-sm rounded bg-white"
        >
          <option v-for="code in codes" :value="code.countryCodes[0]">
            {{ `${code.isoCode3} - ${code.countryCodes[0]}` }}
          </option>
        </select>
        <input
          type="text"
          name="phone"
          v-model="reqObject.phone"
          placeholder="Client's Phone (with DDD)"
          required
          class="p-2 w-full rounded bg-white"
        />
      </div>
      <input
        type="text"
        name="requestIdentifier"
        v-model="reqObject.requestIdentifier"
        class="p-2 w-full rounded"
        placeholder="Request Identifier (optional)"
      />
      <div class="flex gap-2 w-full">
        <input
          type="checkbox"
          name="notificationSMS"
          id="SMS"
          v-model="reqObject.notificationSMS"
        />
        <label for="SMS" class="font-bold">Notificate via SMS</label>
      </div>

      <button
        type="submit"
        class="p-2 bg-slate-100 w-fit rounded-lg font-bold mt-4"
      >
        <p v-if="!isWaiting">SUBMIT</p>
        <svg
          v-if="isWaiting"
          aria-hidden="true"
          class="w-5 h-5 mr-2 text-white animate-spin dark:text-gray-600 fill-gray-900"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
      </button>
      <p v-if="isWaiting">Waiting for location...</p>
    </form>
    <div v-if="postResponse" class="w-full text-center gap-2 pb-4 hidden sm:block border-b-2 border-green-500">
      <h2 v-if="postResponse.status == 200">Send this link to your client: {{ postResponse.url }}</h2>
      <h2 v-if="postResponse.status == 202" class="font-bold text-green-800 mt-5 text-xl mb-4 bg-green-500 text-center">SMS sent!</h2>
      <h2 class="font-bold">POST RESPONSE:</h2>
      <p>{{ JSON.stringify(postResponse, null, 4) }}</p>
      <a :href="postResponse.url">{{ postResponse.url }}</a>
    </div>
    <div v-if="getResponse" class="w-full text-center gap-2 mt-4 pb-4 hidden sm:block border-b-2 border-green-500">
      <h2 class="font-bold">GET RESPONSE:</h2>
      <p>{{ JSON.stringify(getResponse, null, 4) }}</p>
    </div>
    <h2 class="font-bold mt-4 mb-4" v-if="coords">CLIENT'S LOCATION:</h2>
    <Map :Coords="coords" v-if="coords" />
  </div>
</template>
