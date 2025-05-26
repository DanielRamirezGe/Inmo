import DrawerAppBar from "../components/navBarGen";
import MainHeader from "../components/mainHeader";

export default function PrototypeResultsLayout({ children }) {
  return (
    <>
      <DrawerAppBar />
      <MainHeader />
      {children}
    </>
  );
}
