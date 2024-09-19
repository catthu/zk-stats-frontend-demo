import { useUser } from "@/utils/session";
import { faCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { ReactNode, useState } from "react";

const NavBar = () => {
  const [ showUserMenu, setShowUserMenu ] = useState<boolean>(false);
  const onUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  }
  const user = useUser();
  return (
    <div
      className="m-4 py-2 px-12 rounded bg-slate-800 text-white"
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-column gap-8">
        <NavBarItem>
          <Link href="/">Home</Link>
        </NavBarItem>
        <NavBarItem>
          <Link href="/about">About</Link>
        </NavBarItem>
        </div>
        <div className="flex gap-4 items-center">
          {user && user.username}
          <div className="flex items-center hover:cursor-pointer" onClick={onUserMenuClick}>
            <span className="fa-layers fa-fw h-8 w-8" style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faCircle} size="2x" className="text-white mx-auto w-full"/>
            <FontAwesomeIcon icon={faUser} className="text-gray-800 mx-auto w-full"/>
            </span>
          </div>
        </div>
      </div>
      {showUserMenu &&
        <UserMenu authenticated={user?.id !== undefined}/>
      }
    </div>
  )
}

const NavBarItem = ({ children }: {children: ReactNode}) => {
  return (
    <div
      className="hover:underline"
    >
      {children}
    </div>
  )
}

type UserMenuProps = {
  authenticated: boolean;
}

const UserMenu = ({ authenticated }: UserMenuProps) => {
  return (
    <div className="flex flex-col absolute right-0 bg-slate-800 p-2 m-4 rounded">
      {authenticated && <UserMenuItem label="Account" path="/" />}
      {authenticated && <UserMenuItem label="Notifications" path="/" />}
      <UserMenuItem label="Add a Dataset" path="/datasets/upload" />
      {authenticated
      ? <UserMenuItem label="Sign Out" path="/auth/signout" />
      :
        <UserMenuItem label="Sign In" path="/auth" />
      }
    </div>
  )
}

type UserMenuItemProps = {
  label: string;
  path: string;
}

const UserMenuItem = ({ label, path }: UserMenuItemProps) => {
  return (
    <Link href={path} className="px-8 py-4 hover:text-slate-800 hover:bg-indigo-50 rounded">
      { label }
    </Link>
  )
}

export default NavBar;