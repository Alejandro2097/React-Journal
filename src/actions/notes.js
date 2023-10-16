import { db } from '../firebase/firebaseConfig'
import { types } from './../types/types';
import { loadNotes } from './../helpers/loadNodes';
import Swal from 'sweetalert2'
import { fileUpload } from './../helpers/fileUpload';

export const startNewNote = () => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
            url: 'https://res.cloudinary.com/dilzo9sv8/image/upload/v1600414133/xoyl2klzm40jnr23nams.jpg'
        }

        const doc = await db.collection(`${uid}/journal/notes`).add(newNote)
        dispatch( activeNote(doc.id, newNote))
        dispatch( addNewNote(doc.id, newNote))
    }
}

export const activeNote = (id, note) => ({
    type: types.notesActive,
    payload: {
        id,
        ...note
    }
})

export const addNewNote = (id, note) => ({
    type: types.notesAddNew,
    payload: {
        id,
        ...note
    }
})

export const startLoadingNotes = (uid) => {
    return async(dispatch) => {
        const notes = await loadNotes(uid)
        dispatch(setNotes(notes))
    }
}

export const setNotes = ( notes ) => ({
    type: types.notesLoad,
    payload: notes
})

export const startSaveNote = ( note ) => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth

        if (!note.url) {
            delete note.url
        }

        const { id, ...noteToFirestore } = note

        await db.doc(`/${uid}/journal/notes/${note.id}`).update(noteToFirestore)

        dispatch(refreshNote(note.id, noteToFirestore))
        dispatch(activeNote(note.id, noteToFirestore))
        Swal.fire('Saved', note.title, 'success')
    }
}

export const refreshNote = (id, note) => ({
    type: types.notesUpdated,
    payload: {
        id,
        note: {
            id,
            ...note
        }
    }
})

export const startUploading = ( file ) => {
    return async(dispatch, getState) => {
        const { active: activeNote } = getState().notes

        Swal.fire({
            title: 'Uploading...',
            text: 'Please wait...',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading()
            }
        })

        const fileUrl = await fileUpload(file)
        const newNote = { ...activeNote, url: fileUrl}

        dispatch( startSaveNote(newNote) )

        Swal.close()
    }
}

export const startDeleting = ( id ) => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth
        await db.doc(`${ uid }/journal/notes/${ id }`).delete()

        dispatch( deleteNote(id) )
    }
}

export const deleteNote = (id) => ({
    type: types.notesDelete,
    payload: id
})

export const noteLogout = () => ({
    type: types.notesLogoutCleaning
})