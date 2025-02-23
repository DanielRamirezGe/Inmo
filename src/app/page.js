import Image from "next/image";
import styles from "./page.module.css";
import CardHouse from "./components/card";
import MainHeader from "./components/mainHeader";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import DrawerAppBar from "./components/navBar";

export default function Home() {
  const houseDetails = [
    {
      municipio: "Tecámac",
      estado: "Estado de México",
      houseExpample: [
        {
          title: "Los Héroes San Pablo",
          subheader: "Tecámac - Estado de México",
          image: "house_test/los-heroes-san-pablo-sauce.jpg",
          description:
            "Los Héroes San Pablo es un proyecto de vivienda de interés social en el municipio de Bello, Antioquia. Cuenta con apartamentos de 2 y 3 alcobas, con áreas desde 47 m2 hasta 65 m2. El proyecto cuenta con zonas comunes como piscina, juegos infantiles, gimnasio, cancha múltiple, salón social, entre otros.",
          bed: 2,
          shower: 1,
          car: 1,
          size: 57.41,
          key: 1213123,
          imageList: [
            "house_test/los-heroes-san-pablo-sauce.jpg",
            "house_test/sanPabloDepartamento1.jpg",
            "house_test/sanPabloDepartamento2.jpg",
            "house_test/sanPabloDepartamento3.jpg",
            "house_test/sanPabloDepartamento4.jpg",
          ],
        },
        {
          title: "Senderos",
          subheader: "Tecámac - Estado de México",
          image: "house_test/SenderosModeloDiamante.jpg",
          description:
            "Disfruta de una casa amplia pensada en tu familia, con área de construcción de 67.1m2, 3 recámaras en total y 1.5 baños. Pasa tiempo con tu familia en el jardín trasero de 6x4m2 y recibe a tus invitados desde un atractivo frente de vivienda de 6m x 16m de fondo. Tu próximo hogar se entrega además con piso de vinil, boiler, tarja y lavadero, así como cocina equipada y espacios para los clósets. Todo el desarrollo está cercado y cuenta con caseta de vigilancia para tu máxima seguridad. ",
          bed: 3,
          shower: 1.5,
          car: 1,
          size: 77.5,
          price: 1575400,
          key: 121312231,
        },
        {
          title: "Citara",
          subheader: "Huehuetoca - Estado de México",
          image: "house_test/citara.png",
          description:
            "Disfruta de una casa amplia pensada en tu familia, con área de construcción de 67.1m2, 3 recámaras en total y 1.5 baños. Pasa tiempo con tu familia en el jardín trasero de 6x4m2 y recibe a tus invitados desde un atractivo frente de vivienda de 6m x 16m de fondo. Tu próximo hogar se entrega además con piso de vinil, boiler, tarja y lavadero, así como cocina equipada y espacios para los clósets. Todo el desarrollo está cercado y cuenta con caseta de vigilancia para tu máxima seguridad. ",
          bed: 3,
          shower: 1.5,
          car: 1,
          size: 67.1,
          key: 121323,
          imageList: [
            "house_test/los-heroes-san-pablo-sauce.jpg",
            "house_test/sanPabloDepartamento1.jpg",
            "house_test/sanPabloDepartamento2.jpg",
            "house_test/sanPabloDepartamento3.jpg",
            "house_test/sanPabloDepartamento4.jpg",
          ],
        },
      ],
    },
    {
      municipio: "Tizayuca",
      estado: "Estado de México",
      houseExpample: [
        {
          title: "Los Héroes San Pablo",
          subheader: "Tecámac - Estado de México",
          image: "house_test/los-heroes-san-pablo-sauce.jpg",
          description:
            "Los Héroes San Pablo es un proyecto de vivienda de interés social en el municipio de Bello, Antioquia. Cuenta con apartamentos de 2 y 3 alcobas, con áreas desde 47 m2 hasta 65 m2. El proyecto cuenta con zonas comunes como piscina, juegos infantiles, gimnasio, cancha múltiple, salón social, entre otros.",
          bed: 2,
          shower: 1,
          car: 1,
          size: 57.41,
          key: 1213123,
          imageList: [
            "house_test/los-heroes-san-pablo-sauce.jpg",
            "house_test/sanPabloDepartamento1.jpg",
            "house_test/sanPabloDepartamento2.jpg",
            "house_test/sanPabloDepartamento3.jpg",
            "house_test/sanPabloDepartamento4.jpg",
          ],
        },
        {
          title: "Senderos",
          subheader: "Tecámac - Estado de México",
          image: "house_test/SenderosModeloDiamante.jpg",
          description:
            "Disfruta de una casa amplia pensada en tu familia, con área de construcción de 67.1m2, 3 recámaras en total y 1.5 baños. Pasa tiempo con tu familia en el jardín trasero de 6x4m2 y recibe a tus invitados desde un atractivo frente de vivienda de 6m x 16m de fondo. Tu próximo hogar se entrega además con piso de vinil, boiler, tarja y lavadero, así como cocina equipada y espacios para los clósets. Todo el desarrollo está cercado y cuenta con caseta de vigilancia para tu máxima seguridad. ",
          bed: 3,
          shower: 1.5,
          car: 1,
          size: 77.5,
          price: 1575400,
          key: 121312231,
          imageList: [
            "house_test/los-heroes-san-pablo-sauce.jpg",
            "house_test/sanPabloDepartamento1.jpg",
            "house_test/sanPabloDepartamento2.jpg",
            "house_test/sanPabloDepartamento3.jpg",
            "house_test/sanPabloDepartamento4.jpg",
          ],
        },
        {
          title: "Citara",
          subheader: "Huehuetoca - Estado de México",
          image: "house_test/citara.png",
          description:
            "Disfruta de una casa amplia pensada en tu familia, con área de construcción de 67.1m2, 3 recámaras en total y 1.5 baños. Pasa tiempo con tu familia en el jardín trasero de 6x4m2 y recibe a tus invitados desde un atractivo frente de vivienda de 6m x 16m de fondo. Tu próximo hogar se entrega además con piso de vinil, boiler, tarja y lavadero, así como cocina equipada y espacios para los clósets. Todo el desarrollo está cercado y cuenta con caseta de vigilancia para tu máxima seguridad. ",
          bed: 3,
          shower: 1.5,
          car: 1,
          size: 67.1,
          key: 121323,
          imageList: [
            "house_test/los-heroes-san-pablo-sauce.jpg",
            "house_test/sanPabloDepartamento1.jpg",
            "house_test/sanPabloDepartamento2.jpg",
            "house_test/sanPabloDepartamento3.jpg",
            "house_test/sanPabloDepartamento4.jpg",
          ],
        },
      ],
    },
  ];
  return (
    <>
      <DrawerAppBar />
      <MainHeader />

      <div className={styles.page}>
        <main className={styles.main}>
          {houseDetails.map((house, index) => (
            <Box key={index} marginBottom={4}>
              <Typography variant="h5" color="text.secondary">
                {house.municipio} - {house.estado}
              </Typography>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {house.houseExpample.map((houseExpample) => (
                  <Grid key={houseExpample.key} size={{ xs: 4, sm: 4, md: 4 }}>
                    <CardHouse
                      houseDetails={houseExpample}
                      key={houseExpample.key}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
          <Image
            className={styles.logo}
            src="/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
          />
          <ol>
            <li>
              Get started by editing <code>src/app/page.js</code>.
            </li>
            <li>Save and see your changes instantly.</li>
          </ol>

          <div className={styles.ctas}>
            <a
              className={styles.primary}
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={styles.logo}
                src="/vercel.svg"
                alt="Vercel logomark"
                width={20}
                height={20}
              />
              Deploy now
            </a>
            <a
              href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondary}
            >
              Read our docs
            </a>
          </div>
        </main>
        <footer className={styles.footer}>
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/file.svg"
              alt="File icon"
              width={16}
              height={16}
            />
            Learn
          </a>
          <a
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/window.svg"
              alt="Window icon"
              width={16}
              height={16}
            />
            Examples
          </a>
          <a
            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              aria-hidden
              src="/globe.svg"
              alt="Globe icon"
              width={16}
              height={16}
            />
            Go to nextjs.org →
          </a>
        </footer>
      </div>
    </>
  );
}
