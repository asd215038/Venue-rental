import { createStore } from 'vuex'
import { firebaseAuth } from '@/config/firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile 
} from 'firebase/auth';

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
      return state.user
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
      const response = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      if (response) {
        await updateProfile(response.user, {
          displayName: name
        })
        context.commit('SET_USER_DISPLAYNAME', response.user.displayName)
        context.commit('SET_USER_EMAIL', response.user.email)
        context.commit('SET_LOGGED_IN', true)
        console.log(name)
      } else {
        throw new Error('Unable to register user')
      }
    },

    async logIn(context, {email, password}) {
      const response = await signInWithEmailAndPassword(firebaseAuth, email, password)
      if (response) {
        context.commit('SET_USER_DISPLAYNAME', response.user.displayName)
        context.commit('SET_USER_EMAIL', response.user.email)
        context.commit('SET_LOGGED_IN', true)
        console.log(response.user)
      } else {
        throw new Error('login failed')
      }
    },

    async logOut(context) {
      await signOut(firebaseAuth)
      context.commit('SET_USER_DISPLAYNAME', null)
      context.commit('SET_USER_EMAIL', null)
      context.commit('SET_LOGGED_IN', false)
    }, catch(error) {
      console.error(error)
    }

    // async fetchUser(context, user) {
    //   context.commit("SET_LOGGED_IN", user !== null);
    //   if (user) {
    //     context.commit("SET_USER", {
    //       displayName: user.displayName,
    //       email: user.email
    //     });
    //   } else {
    //     context.commit("SET_USER", null);
    //   }
    // }
  },
  modules: {
  }
})
