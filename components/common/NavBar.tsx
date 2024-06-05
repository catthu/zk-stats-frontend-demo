import { useUser } from "@/utils/session";
import { faCircle, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [ showUserMenu, setShowUserMenu ] = useState<boolean>(false);
  const onUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  }
  const user = useUser();
  return (
    <div>
      <div className="my-4 px-24 flex justify-between w-full">
        <div>
          <Link href="/">Home</Link>
        </div>
        <div className="flex gap-4 items-center">
          {user && user.username}
          <div className="flex items-center hover:cursor-pointer" onClick={onUserMenuClick}>
            <span className="fa-layers fa-fw h-8 w-8" style={{ backgroundColor: 'transparent' }}>
            <FontAwesomeIcon icon={faCircle} size="2x" className="text-blue-300 mx-auto w-full"/>
            <FontAwesomeIcon icon={faUser} className="text-blue-800 mx-auto w-full"/>
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

type UserMenuProps = {
  authenticated: boolean;
}

const UserMenu = ({ authenticated }: UserMenuProps) => {
  return (
    <div className="flex flex-col absolute right-0 bg-white px-4 py-4">
      <UserMenuItem label="Account" path="/" />
      <hr />
      <UserMenuItem label="Notifications" path="/" />
      <hr />
      <UserMenuItem label="Add a Dataset" path="/datasets/upload" />
      <hr />
      {authenticated
      ? <UserMenuItem label="Sign Out" path="/auth/signout" />
      :
        <UserMenuItem label="Sign Up" path="/auth" />
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
    <Link href={path} className="px-8 py-4">
      { label }
    </Link>
  )
}

export default NavBar;