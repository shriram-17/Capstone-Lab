import {getDownloadURL, getStorage, ref} from 'firebase/storage';
import {firebaseApp} from "../../../../lib/firebaseclient";

const bucket = getStorage(firebaseApp)

export async function GET(request: Request, { params }: { params: { name: string } }) {
    try {
        const filename = params.name;
        const buffer = await downloadFile(filename);
        return new Response(buffer, { status: 200 });
    } catch (error) {
        console.error('Error downloading file:', error);
        return new Response('Error downloading file', { status: 500 });
    }
}

async function downloadFile(filename: string): Promise<ArrayBuffer> {
    try {
        const fileRef = ref(bucket, filename);
        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.arrayBuffer();
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
}
