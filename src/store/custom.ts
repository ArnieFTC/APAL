import { doc, getDoc, setDoc } from 'firebase/firestore';
import { EMPTY_CUSTOM, type CustomContent } from '../content/custom';
import { db } from '../firebase';

/** A class's own questions and topics: classes/{code}/content/custom. */
const ref = (code: string) => doc(db, 'classes', code, 'content', 'custom');

export async function loadCustom(code: string): Promise<CustomContent> {
  try {
    const data = (await getDoc(ref(code))).data() as Partial<CustomContent> | undefined;
    return { topics: data?.topics ?? [], questions: data?.questions ?? [] };
  } catch {
    // Offline with nothing cached yet: the built-in questions still work.
    return EMPTY_CUSTOM;
  }
}

export const saveCustom = (code: string, c: CustomContent) => setDoc(ref(code), c);
