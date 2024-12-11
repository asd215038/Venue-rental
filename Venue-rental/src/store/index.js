import { createStore } from 'vuex'
import { firebaseAuth } from '@/config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default createStore({
  state: {
    user: {
      loggedIn: false,
      displayName: null,
      email: null,
      isAdmin: false,
    },
    selectedVenueName: '',
  },
  getters: {
    user(state) {
      return state.user;
    },
    isLoggedIn(state) {
      return state.user.loggedIn;
    },
    isAdmin(state) {
      return state.user.isAdmin;
    },
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
    },
    SET_VENUE_NAME(state, venueName) {  // 新增 mutation
      state.selectedVenueName = venueName;
    },
    CLEAN_VENUE_NAME(state) {  // 新增 mutation
      state.selectedVenueName = '';
    },
    SET_USER_ADMIN(state, isAdmin) {
      state.user.isAdmin = isAdmin;
    },
  },
  actions: {
    async register(context, { email, password, name }) {
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

    async logIn(context, { email, password }) {
      try {
        const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
        if (response) {
          context.commit('SET_USER_DISPLAYNAME', response.user.displayName);
          context.commit('SET_USER_EMAIL', response.user.email);
          context.commit('SET_LOGGED_IN', true);
          await context.dispatch('checkAdminStatus');  // 新增此行
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error(error);
      }
    },

    initAuth({ commit, dispatch }) {  // 修改這裡，添加 dispatch
      onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          commit('SET_USER_DISPLAYNAME', user.displayName);
          commit('SET_USER_EMAIL', user.email);
          commit('SET_LOGGED_IN', true);
          await dispatch('checkAdminStatus');  // 新增此行
        } else {
          commit('SET_USER_DISPLAYNAME', null);
          commit('SET_USER_EMAIL', null);
          commit('SET_LOGGED_IN', false);
          commit('SET_USER_ADMIN', false);  // 新增此行
        }
      });
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

    //預約時 紀錄選取到的場地 
    setVenueName({ commit }, venueName) {  // 新增 action
      commit('SET_VENUE_NAME', venueName);
    },
    cleanVenueName({ commit }) {  // 新增 action
      commit('CLEAN_VENUE_NAME');
    },
    //檢查管理員狀態
    async checkAdminStatus({ commit, state }) {
      try {
        if (!state.user.email) return;
        
        const db = getFirestore();
        const usersRef = collection(db, 'users');
        // 使用 email 來查詢對應的用戶文檔
        const q = query(usersRef, where('email', '==', state.user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          console.log('User doc data:', userDoc.data()); // 調試用
          commit('SET_USER_ADMIN', userDoc.data().isAdmin || false);
        } else {
          commit('SET_USER_ADMIN', false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        commit('SET_USER_ADMIN', false);
      }
    },
  },
  modules: {}
})
