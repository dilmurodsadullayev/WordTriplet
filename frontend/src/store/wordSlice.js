import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'http://127.0.0.1:8000/api/words/';
const ADMIN_API_URL = 'http://127.0.0.1:8000/admin/words/';

export const fetchWords = createAsyncThunk('words/fetchWords', async () => {
    const response = await fetch(API_URL);
    return await response.json();
});

export const addWord = createAsyncThunk('words/addWord', async (wordData) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wordData),
    });
    return await response.json();
});

export const deleteWord = createAsyncThunk('words/deleteWord', async (id, { rejectWithValue }) => {
    try {
        const response = await fetch(`${ADMIN_API_URL}${id}/`, { method: 'DELETE' });
        
        if (response.status === 403) {
            return rejectWithValue("Sizda ushbu ma'lumotni o'chirish uchun ruxsat yo'q! (Admin bo'lishingiz shart)");
        }
        
        if (!response.ok) throw new Error("Xatolik yuz berdi");

        return id;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

const wordSlice = createSlice({
    name: 'words',
    initialState: { items: [], loading: false, error: null },
    reducers: {
        clearError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWords.pending, (state) => { state.loading = true; })
            .addCase(fetchWords.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(deleteWord.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.word.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteWord.rejected, (state, action) => {
                state.error = action.payload; // 403 xatosi shu yerga tushadi
            });
    },
});

export const { clearError } = wordSlice.actions;
export default wordSlice.reducer;