"use client";
import Login from "@/components/Forms/Login/Login";
import Registration from "@/components/Forms/Registration/Registration";
import Modal from "@/components/Modal/Modal";
import { useModal } from "@/providers/ModalContext";
import { useAppSelector } from "@/redux";

function AuthorizationForm() {
    const { isModalActive, closeModal, isLoginMode, switchMode } = useModal();
    const user = useAppSelector(state => state.user.currentUser);
    const isLoggedIn = !!user;

    if (isLoggedIn) return null;

    return (
        <>
            {isModalActive && (
                <Modal
                    contentClassName="!pt-10 flex-col items-center flex"
                    minwidthToUnbox={500}
                    cantClose={false}
                    setActive={() => closeModal(true)}
                    active={isModalActive}
                >
                    {isLoginMode ? <Login /> : <Registration />}
                    <button onClick={switchMode}>
                        Switch to {isLoginMode ? "Registration" : "Login"}
                    </button>
                </Modal>
            )}
        </>
    );
}

export default AuthorizationForm;