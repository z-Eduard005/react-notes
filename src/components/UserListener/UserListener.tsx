import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { auth } from "../../firebase";
import { setAuthChecked, setUserUID } from "../../reducers/userReducer";
import { useAppDispatch } from "../../store/hooks";

const UserListener: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const disableListener = onAuthStateChanged(auth, (user) => {
      user && dispatch(setUserUID(user.uid));
      dispatch(setAuthChecked(true));
    });

    return () => disableListener();
  }, []);

  return null;
};

export default UserListener;
