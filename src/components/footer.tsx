const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white p-8 text-center text-xxs invert-0 dark:border-gray-800 dark:bg-black">
      Made with ♥ by{" "}
      <a
        target="_blank"
        className="text-blue-600 transition-colors hover:text-blue-700 hover:underline dark:text-blue-500 dark:hover:text-blue-600"
        href="https://github.com/tautastic"
        rel="noreferrer"
      >
        Ahmed Sami
      </a>
    </footer>
  );
};

export default Footer;
