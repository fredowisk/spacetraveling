import { usePathname } from 'next/navigation';
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

interface ActiveLinkProps extends LinkProps {
  children: ReactNode;
  activeClassName?: string;
}

export function ActiveLink({
  activeClassName,
  children,
  ...rest
}: ActiveLinkProps): JSX.Element {
  const className = usePathname() === rest.href ? activeClassName : '';

  return (
    <Link {...rest} className={className}>
      {children}
    </Link>
  );
}
