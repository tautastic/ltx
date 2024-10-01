import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, Edit, ExternalLink, Info, LogOut, User } from "lucide-react";
import { ThemeSelect } from "~/components/theme-select";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const AuthDropdown = () => {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    if (status === "authenticated") {
      signOut({
        callbackUrl: "/",
      }).catch((error) => {
        console.log(error);
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={status === "loading"} asChild>
        <Button
          Loading={status === "loading"}
          Type="secondary"
          aria-label="Open Menu"
          Prefix={
            <Avatar className="h-6 w-6">
              <AvatarImage src={session?.user?.image || undefined} alt={"User Image"} />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          }
          Suffix={<ChevronDown className="h-4 w-4" />}
        />
      </DropdownMenuTrigger>
      {status !== "loading" && (
        <DropdownMenuContent className="w-56 select-none">
          {session?.user?.name && (
            <DropdownMenuGroup>
              <Link href={`/u/${session?.user?.username}`}>
                <DropdownMenuLabel className="bg-gray-50 text-center dark:bg-gray-950">
                  <span>
                    Signed in as <b>{session.user.name}</b>
                  </span>
                </DropdownMenuLabel>
              </Link>
              <DropdownMenuSeparator />
            </DropdownMenuGroup>
          )}
          {session?.user?.username ? (
            <DropdownMenuGroup>
              <Link href={`/u/${session?.user?.username}`}>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/create">
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>New Document</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : (
            <DropdownMenuGroup>
              <Link href="/auth/signin">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Sign in</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href="/about/privacy">
              <DropdownMenuItem>
                <Info className="mr-2 h-4 w-4" />
                <span>Privacy Policy</span>
              </DropdownMenuItem>
            </Link>
            <a target="_blank" href="https://github.com/tautastic/ltx/issues/new" rel="noreferrer">
              <DropdownMenuItem className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Report a bug
                <ExternalLink className="mb-1 ml-1 h-3 w-3" />
              </DropdownMenuItem>
            </a>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup className="bg-gray-50 p-3 dark:bg-gray-950">
            <ThemeSelect />
          </DropdownMenuGroup>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  );
};

export default AuthDropdown;
