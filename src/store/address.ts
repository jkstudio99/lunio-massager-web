import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressState {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, data: Partial<Address>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      addresses: [],

      addAddress: (address) =>
        set((state) => {
          const id = crypto.randomUUID();
          const isFirst = state.addresses.length === 0;
          const newAddr = { ...address, id, isDefault: isFirst ? true : address.isDefault };
          // If new address is default, unset others
          const addresses = newAddr.isDefault
            ? [...state.addresses.map((a) => ({ ...a, isDefault: false })), newAddr]
            : [...state.addresses, newAddr];
          return { addresses };
        }),

      updateAddress: (id, data) =>
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...data } : a)),
        })),

      removeAddress: (id) =>
        set((state) => {
          const filtered = state.addresses.filter((a) => a.id !== id);
          // If removed address was default, set first as default
          if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
            filtered[0].isDefault = true;
          }
          return { addresses: filtered };
        }),

      setDefault: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),
    }),
    { name: 'lunio-addresses' }
  )
);
