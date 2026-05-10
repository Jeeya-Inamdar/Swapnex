import { atom } from "recoil";

const createPostModalAtom = atom({
	key: "createPostModalAtom",
	default: false,
});

export default createPostModalAtom;
