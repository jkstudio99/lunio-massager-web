import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ProfileState {
  avatarUrl: string | null;
  displayName: string;
  phone: string;
  birthday: string;
  gender: string;
  setAvatar: (url: string | null) => void;
  setDisplayName: (name: string) => void;
  setPhone: (phone: string) => void;
  setBirthday: (birthday: string) => void;
  setGender: (gender: string) => void;
  updateProfile: (data: Partial<Pick<ProfileState, 'displayName' | 'phone' | 'birthday' | 'gender'>>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      avatarUrl: null,
      displayName: '',
      phone: '',
      birthday: '',
      gender: '',

      setAvatar: (url) => set({ avatarUrl: url }),
      setDisplayName: (name) => set({ displayName: name }),
      setPhone: (phone) => set({ phone }),
      setBirthday: (birthday) => set({ birthday }),
      setGender: (gender) => set({ gender }),
      updateProfile: (data) => set(data),
    }),
    { name: 'lunio-profile' }
  )
);
