<template>
    <table class="table table-striped">
    <thead>
      <tr>
        <th v-for="(header, index) in tableHeaders" :key="index" scope="col">{{ header }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="venue in venues" :key="venue.venueId">
        <th scope="row">{{ venue.venueId }}</th>
        <td>{{ venue.venues_name }}</td>
        <td>{{ venue.price_per_hour }}</td>
        <td>{{ venue.capacity }}</td>
      </tr>
    </tbody>
  </table>
  </template>
  
  <script>
  import { db } from '@/config/firebaseConfig';
  import { collection, where, query, getDocs } from 'firebase/firestore';
  
  export default {
    data() {
      return {
        venues: [],
        tableHeaders: ["場地ID", "場地名稱", "每小時費用", "容納人數"]
      };
    },
    mounted() {
      this.getVenues();
    },
    methods: {
      async getVenues() {
        const querySnapshot = await getDocs(collection(db, "venues"));
        const venues = [];
        querySnapshot.forEach((doc) => {
          let appData = doc.data();
          appData.venueId = doc.id;
          venues.push({
            venueId: appData.venueId,
            venues_name: appData.venues_name,
            price_per_hour: appData.price_per_hour,
            capacity: appData.capacity,
          });
        });
        this.venues = venues;
        // console.log(this.blogs);
      },
    },
  }
  
  </script>
  
  <style>
  
  </style>
  