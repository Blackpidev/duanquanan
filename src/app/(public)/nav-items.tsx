"use client";

import { useLogoutMutation } from "@/app/queries/useAuth";
import { useGuestLogoutMutation } from "@/app/queries/useGuest";
import { useAppContext } from "@/components/app-provider";
import { Role } from "@/constants/type";
import { cn, handleErrorApi } from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const menuItems: {
  title: string;
  href: string;
  role?: RoleType[];
  hideWhenLogin?: boolean;
}[] = [
  {
    title: "Trang chủ",
    href: "/",
  },
  {
    title: "Menu",
    href: "/guest/menu",
    role: [Role.Guest],
  },
  {
    title: "Đơn hàng",
    href: "/guest/orders",
    role: [Role.Guest],
  },
  {
    title: "Đăng nhập",
    href: "/login",
    hideWhenLogin: true,
  },
  {
    title: "Quản lý",
    href: "/manage/dashboard",
    role: [Role.Owner, Role.Employee],
  },
];

export default function NavItems({ className }: { className?: string }) {
  const { role, setRole } = useAppContext();
  const logoutMutation = useLogoutMutation();
  const logoutGuestMutation = useGuestLogoutMutation();
  const router = useRouter();

  const logout = async () => {
    try {
      if (role === Role.Guest) {
        await logoutGuestMutation.mutateAsync();
      } else {
        await logoutMutation.mutateAsync();
      }
      setRole();
      router.push("/");
    } catch (error) {
      handleErrorApi({
        error,
      });
    }
  };

  return (
    <>
      {menuItems.map((item) => {
        // trường hợp đã đăng nhạp thì chỉ hiển thị menu đăng nhập
        const isAuth = role && item.role && item.role.includes(role);
        // trường hợp menu item có thể hiển thị cho đã đăng nhập hoặc chưa đăng nhập
        const canShow =
          (item.role === undefined && !item.hideWhenLogin) ||
          (!role && item.hideWhenLogin);
        if (isAuth || canShow) {
          return (
            <Link href={item.href} key={item.href} className={className}>
              {item.title}
            </Link>
          );
        }
        return null;
      })}{" "}
      {role && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className={cn(className, "cursor-pointer")}>Đăng xuất</div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Bạn có chắc chắn muốn đăng xuất không?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Việc đăng xuất có thể khiến bạn mất đi hoá đơn của bạn
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={logout}>Ok</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
