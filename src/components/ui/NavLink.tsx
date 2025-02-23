import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export const NavLink = ({ href, className, children }: NavLinkProps) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link href={href} className={`${isActive ? 'active' : ''} ${className || ''}`}>
      {children}
    </Link>
  );
};

export default NavLink;
