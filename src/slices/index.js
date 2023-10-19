import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || {
    cmdId: `CMD-${Date.now()}`,
    items: [],
    total: 0,
  },
  user: JSON.parse(localStorage.getItem("user")) || {}
};

export const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addItem: (state, { payload }) => {
      const item = {
        itemId: parseFloat(payload.itemId),
        itemName: payload.itemName,
        price: parseFloat(payload.price),
        users_id: payload.users_id,
        userName: payload.userName,
        pictureOne: payload.pictureOne,
        quantity: 1,
      };

      // Vérifier si l'élément est déjà présent dans le panier
      const index = state.cart.items.findIndex(
        (existingItem) => existingItem.itemId === item.itemId
      );

      if (index !== -1) {
        // L'élément est déjà présent, incrémenter la quantité
        state.cart.items[index].quantity++;
      } else {
        // L'élément n'est pas présent, l'ajouter au panier
        state.cart.items.push(item);
      }

      // Mettre à jour le total
      state.cart.total += item.price;

      // Mettre à jour le localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    deleteItem: (state, { payload }) => {
      const index = state.cart.items.findIndex(
        (existingItem) => existingItem.itemId === payload.itemId
      );

      if (index !== -1) {
        const item = state.cart.items[index];
        if (item.quantity > 1) {
          // La quantité est supérieure à 1, décrémenter la quantité
          item.quantity--;
        } else {
          // La quantité est égale à 1, supprimer complètement l'élément
          state.cart.items.splice(index, 1);
        }

        // Mettre à jour le total
        state.cart.total -= item.price;

        // Mettre à jour le localStorage
        localStorage.setItem("cart", JSON.stringify(state.cart));
      }
    },
    paidCart: (state, action) => {
      const { wallet, totalCmd } = action.payload;
      const updatedWallet = wallet - totalCmd;

      // Mettre à jour le state
      state.user.wallet = updatedWallet;
      state.cart.cmdId = `CMD-${Date.now()}`;
      state.cart.items = [];
      state.cart.total = 0;

      // Mettre à jour le localstorage
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
});

export const { addItem, deleteItem, paidCart } = dataSlice.actions;

export default dataSlice.reducer;
