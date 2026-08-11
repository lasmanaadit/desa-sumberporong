// src/components/Navbar.jsx

import React, { useState } from 'react';
import {
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import logo from '/src/assets/logo.webp';


const Navbar = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Untuk mendeteksi halaman aktif
  const location = useLocation();

  // Untuk navigasi
  const navigate = useNavigate();

  // Untuk mendeteksi menu yang sedang di-hover
  const [hoveredMenu, setHoveredMenu] = useState(null);


  // ==========================================
  // DATA MENU
  // ==========================================

  const menus = [
    {
      name: 'Beranda',
      path: '/',
    },
    {
      name: 'Profile',
      path: '/profile',
    },
    {
      name: 'Layanan',
      path: '/layanan',
    },
    {
      name: 'Statistik',
      path: '/statistik',
    },
    {
      name: 'UMKM',
      path: '/umkm',
    },
    {
      name: 'Berita',
      path: '/berita',
    },
    {
      name: 'Galeri',
      path: '/galeri',
    },
  ];


  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMenu = () => {
    setIsMenuOpen(false);
  };


  // ==========================================
  // CEK ACTIVE MENU
  // ==========================================

  const isActiveMenu = (path) => {

    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname === path;
  };


  return (

    <nav
      className="
        fixed
        top-0
        left-0
        w-full
        z-50

        bg-surface/90
        dark:bg-on-background/90

        backdrop-blur-md
        shadow-sm

        transition-all
        duration-300
      "
    >

      {/* ==================================================
          NAVBAR UTAMA
      ================================================== */}

      <div
        className="
          flex
          justify-between
          items-center

          h-18

          px-margin-mobile
          md:px-margin-desktop

          mx-auto
        "
      >


        {/* ==================================================
            LOGO
        ================================================== */}

        <NavLink
          to="/"

          className="
            flex
            items-center
            gap-sm
            shrink-0
          "
        >

          <img
            src={logo}
            alt="Logo Desa Sumberporong"

            className="
              w-12
              h-12
              object-contain
            "
          />


          <div className="flex flex-col">

            <span
              className="
                font-headline-md
                text-headline-md
                font-bold

                text-primary
                dark:text-primary-fixed

                leading-tight
              "
            >
              Desa Sumberporong
            </span>


            <span
              className="
                text-[10px]
                font-medium

                text-on-surface-variant
                dark:text-surface-variant

                leading-tight
              "
            >
              Pemerintah Desa Sumberporong
            </span>

          </div>

        </NavLink>



        {/* ==================================================
            DESKTOP RIGHT AREA
            MENU + TOMBOL PENGURUSAN
        ================================================== */}

        <div
          className="
            hidden
            md:flex
            items-center
            ml-auto
          "
        >


          {/* ==================================================
              MENU DESKTOP
          ================================================== */}

          <div
            className="
              flex
              items-center
              gap-lg

              font-label-md
              text-label-md
            "
          >

            {menus.map((menu) => {

              const active = isActiveMenu(menu.path);

              return (

                <NavLink
                  key={menu.path}

                  to={menu.path}

                  end={menu.path === '/'}

                  onMouseEnter={() =>
                    setHoveredMenu(menu.path)
                  }

                  onMouseLeave={() =>
                    setHoveredMenu(null)
                  }

                  className={`
                    relative

                    py-3
                    px-1

                    transition-colors
                    duration-200

                    ${
                      active
                        ? `
                          text-primary
                          dark:text-primary-fixed
                        `
                        : `
                          text-on-surface-variant
                          dark:text-surface-variant

                          hover:text-primary
                          dark:hover:text-primary-fixed
                        `
                    }
                  `}
                >

                  {/* Nama menu */}

                  <span className="relative z-10">
                    {menu.name}
                  </span>



                  {/* ==================================================
                      ACTIVE INDICATOR
                  ================================================== */}

                  {active && (

                    <motion.span
                      layoutId="navbar-active-indicator"

                      className="
                        absolute

                        left-0
                        right-0
                        bottom-0

                        h-0.75

                        rounded-full

                        bg-primary
                        dark:bg-primary-fixed
                      "

                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 35,
                      }}
                    />

                  )}



                  {/* ==================================================
                      HOVER INDICATOR
                  ================================================== */}

                  <AnimatePresence>

                    {hoveredMenu === menu.path &&
                      !active && (

                      <motion.span

                        initial={{
                          opacity: 0,
                          scaleX: 0,
                        }}

                        animate={{
                          opacity: 0.35,
                          scaleX: 1,
                        }}

                        exit={{
                          opacity: 0,
                          scaleX: 0,
                        }}

                        transition={{
                          duration: 0.2,
                          ease: 'easeOut',
                        }}

                        className="
                          absolute

                          left-0
                          right-0
                          bottom-0

                          h-0.5

                          rounded-full

                          bg-primary
                          dark:bg-primary-fixed

                          origin-center
                        "
                      />

                    )}

                  </AnimatePresence>

                </NavLink>

              );

            })}

          </div>



          {/* ==================================================
              TOMBOL PENGURUSAN SURAT
          ================================================== */}

          <motion.button

            onClick={() => {
              navigate('/login');
              closeMenu();
            }}

            initial={{
              opacity: 0,
              x: 20,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            whileHover={{
              scale: 1.05,
              y: -2,
            }}

            whileTap={{
              scale: 0.96,
              y: 0,
            }}

            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}

            className="
              ml-lg

              flex
              items-center
              gap-2

              px-5
              py-2.5

              rounded-lg

              bg-primary
              text-white

              font-label-md
              font-medium

              shadow-sm

              hover:shadow-md

              transition-shadow
              duration-200
            "
          >

            <span
              className="
                material-symbols-outlined
                text-lg
              "
            >
              account_circle
            </span>

            Login

          </motion.button>

        </div>



        {/* ==================================================
            MOBILE BURGER BUTTON
        ================================================== */}

        <button

          className="
            md:hidden

            p-sm

            text-on-surface-variant

            hover:text-primary

            transition-colors
          "

          onClick={() =>
            setIsMenuOpen(!isMenuOpen)
          }

          aria-label="Toggle menu"
        >

          <span
            className="
              material-symbols-outlined
              text-2xl
            "
          >
            {isMenuOpen ? 'close' : 'menu'}
          </span>

        </button>

      </div>



      {/* ==================================================
          MOBILE MENU
      ================================================== */}

      <AnimatePresence>

        {isMenuOpen && (

          <motion.div

            initial={{
              height: 0,
              opacity: 0,
            }}

            animate={{
              height: 'auto',
              opacity: 1,
            }}

            exit={{
              height: 0,
              opacity: 0,
            }}

            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}

            className="
              md:hidden
              overflow-hidden
            "
          >

            <div
              className="
                flex
                flex-col

                bg-surface/95
                dark:bg-on-background/95

                backdrop-blur-md

                border-t
                border-outline-variant/20

                px-margin-mobile
                py-md

                gap-sm

                font-label-md
                text-label-md
              "
            >


              {/* MENU MOBILE */}

              {menus.map((menu) => {

                const active =
                  isActiveMenu(menu.path);

                return (

                  <NavLink
                    key={menu.path}

                    to={menu.path}

                    end={menu.path === '/'}

                    onClick={closeMenu}

                    className={`
                      relative

                      py-3
                      px-3

                      rounded-lg

                      transition-all
                      duration-200

                      ${
                        active
                          ? `
                            bg-primary/10

                            text-primary
                            dark:text-primary-fixed
                          `
                          : `
                            text-on-surface-variant
                            dark:text-surface-variant

                            hover:bg-primary/5

                            hover:text-primary
                            dark:hover:text-primary-fixed
                          `
                      }
                    `}
                  >

                    <span>
                      {menu.name}
                    </span>

                  </NavLink>

                );

              })}



              {/* ==================================================
                  TOMBOL PENGURUSAN MOBILE
              ================================================== */}

              <motion.button

                onClick={() => {
                  navigate('/login');
                  closeMenu();
                }}

                whileTap={{
                  scale: 0.97,
                }}

                className="
                  flex
                  items-center
                  justify-center
                  gap-2

                  w-full

                  mt-sm

                  py-3
                  px-4

                  rounded-lg

                  bg-primary
                  text-white

                  font-medium

                  shadow-sm
                "
              >

                <span
                  className="
                    material-symbols-outlined
                    text-lg
                  "
                >
                  account_circle
                </span>

                Login

              </motion.button>


            </div>

          </motion.div>

        )}

      </AnimatePresence>

    </nav>

  );

};


export default Navbar;