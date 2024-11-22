import { createStore } from 'vuex'
import { firebaseAuth } from '@/config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';

export default createStore({
  state: {
    user: {
      loggedIn: false,
      displayName: null,
      email: null
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.user.loggedIn;
    }
  },
  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER_DISPLAYNAME(state, displayName) {
      state.user.displayName = displayName;
    },
    SET_USER_EMAIL(state, email) {
      state.user.email = email;
    }
  },
  actions: {
    async register(context, {email, password, name}) {
      try {
        const response = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        if (response) {
          await updateProfile(response.user, { displayName: name });
          context.commit('SET_USER_DISPLAYNAME', response.user.displayName);
          context.commit('SET_USER_EMAIL', response.user.email);
          context.commit('SET_LOGGED_IN', true);
        } else {
          throw new Error('Unable to register user');
        }
      } catch (error) {
        console.error(error);
      }
    },

    async logIn(context, {email, password}) {
      try {
        const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
        if (response) {
          context.commit('SET_USER_DISPLAYNAME', response.user.displayName);
          context.commit('SET_USER_EMAIL', response.user.email);
          context.commit('SET_LOGGED_IN', true);
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error(error);
      }
    },

    async logOut(context) {
      try {
        await signOut(firebaseAuth);
        context.commit('SET_USER_DISPLAYNAME', null);
        context.commit('SET_USER_EMAIL', null);
        context.commit('SET_LOGGED_IN', false);
      } catch (error) {
        console.error(error);
      }
    },

    initAuth({ commit }) {
      onAuthStateChanged(firebaseAuth, (user) => {
        if (user) {
          commit('SET_USER_DISPLAYNAME', user.displayName);
          commit('SET_USER_EMAIL', user.email);
          commit('SET_LOGGED_IN', true);
        } else {
          commit('SET_USER_DISPLAYNAME', null);
          commit('SET_USER_EMAIL', null);
          commit('SET_LOGGED_IN', false);
        }
      });
    }
  },
  modules: {}
})
