// /finder leitet nur noch auf den Reisefinder der Startseite weiter.
export const metadata = {
  title: 'Reisefinder | ApeAround',
  robots: { index: false, follow: false },
};

export default function FinderLayout({ children }) {
  return children;
}
