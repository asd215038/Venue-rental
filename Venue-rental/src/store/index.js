import { createStore } from 'vuex'
import { firebaseAuth } from '@/config/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
    SET_VENUE_NAME(state, venueName) {
      state.selectedVenueName = venueName;
    },
    CLEAN_VENUE_NAME(state) {
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

          // 添加用戶到 Firestore，初始狀態 `enabled: false`
          const db = getFirestore();
          const usersRef = collection(db, 'users');
          await updateDoc(doc(usersRef, response.user.email), {
            email: email,
            displayName: name,
            isAdmin: false,
            enabled: false, // 初始設置為未啟用
          });

          toast.info('註冊成功！驗證信已發送到您的信箱，請查收。',{
            autoClose: 1000,
            position: toast.POSITION.TOP_CENTER,
          });
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
          await context.dispatch('checkAdminStatus'); // 檢查管理員狀態
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        console.error(error);
      }
    },

    async updateUserStatus(context, user) {
      if (user.emailVerified) {
        try {
          const db = getFirestore();
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', user.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const userDocRef = querySnapshot.docs[0].ref;
            const userData = querySnapshot.docs[0].data();

            if (!userData.enabled) {
              await updateDoc(userDocRef, { enabled: true });
              console.log('用戶已啟用');
            }
          }
        } catch (error) {
          console.error('Error updating user enabled status:', error);
        }
      }
    },

    initAuth({ commit, dispatch }) {
      onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          commit('SET_USER_DISPLAYNAME', user.displayName);
          commit('SET_USER_EMAIL', user.email);
          commit('SET_LOGGED_IN', true);

          // 檢查用戶電子郵件驗證狀態並更新 `enabled`
          await dispatch('updateUserStatus', user);

          // 檢查管理員權限
          await dispatch('checkAdminStatus');
        } else {
          commit('SET_USER_DISPLAYNAME', null);
          commit('SET_USER_EMAIL', null);
          commit('SET_LOGGED_IN', false);
          commit('SET_USER_ADMIN', false);
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

    setVenueName({ commit }, venueName) {
      commit('SET_VENUE_NAME', venueName);
    },

    cleanVenueName({ commit }) {
      commit('CLEAN_VENUE_NAME');
    },

    async checkAdminStatus({ commit, state }) {
      try {
        if (!state.user.email) return;

        const db = getFirestore();
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', state.user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
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
  modules: {},
});
