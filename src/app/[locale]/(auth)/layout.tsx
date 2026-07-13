interface Props {
  children: React.ReactNode;
}

export default function LocaleLayout({ children }: Props) {
  return <div className="mt-10 mb-10 flex items-center justify-center">{children}</div>;
}
