/* Imagens dos projetos portfólio */
const IMAGES = { 
  "logo": "../images/logo.png", 
  
};

/* Número de WhatsApp da marcenaria que recebe as conversas (DDI + DDD + número, só dígitos) */
const WHATSAPP_NUMBER = '+5511947690687';
/* Link do Instagram da marcenaria */
const INSTAGRAM_URL  = 'https://www.instagram.com/marcenaria.eise/';
/* Quantos projetos aparecem antes do botão "Ver mais projetos" */
const PROJECTS_PAGE_SIZE = 4;
/* Ano de fundação, usado nos anéis da seção História */
const FOUNDED = 1982;

/* ==========================================================
   PROJETOS
   Imagem, categoria, título, alt, descrição. 
   ========================================================== */
const PROJECTS = [
  {
    img: '../images/lareira.png',
    cat: 'Sala de estar',
    title: '',
    alt: 'Sala com lareira em pedra, estantes em madeira e poltronas de couro',
    desc: ''
  },

  {
    img: '../images/cozinha.dog.png',
    cat: 'Cozinha',
    title: '',
    alt: 'Cozinha com armários',
     desc: ''
  },

  {
    img: '../images/cozinha.frente.png',
    cat: 'Cozinha',
    title: '',
    alt: 'Cozinha',
    desc: ''
  },


  {
    img: '../images/armários.png',
    cat: 'Cozinha',
    title: '',
    alt: 'Armários',
    desc: ''
  },

  {
    img: '../images/mesa.png',
    cat: 'Sala de estar',
    title: '',
    alt: 'Mesa em uma sala de estar',
    desc: ''
  },

  {
    img: '../images/cozinha.led.png',
    cat: 'Cozinha',
    title: '',
    alt: 'Cozinha',
    desc: ''
  },

  {
    img: '../images/quarto.quatro.png',
    cat: 'Quarto',
    title: '',
    alt: 'Quarto com camas',
    desc: ''
  },

  {
    img: '../images/frente.qq.png',
    cat: 'Quarto',
    title: '',
    alt: 'Quarto com camas',
    desc: ''
  },

  {
    img: '../images/estante.sala.png',
    cat: 'Sala',
    title: '',
    alt: 'Estante na sala',
     desc: ''
  },

   {
    img: '../images/banheiro.1branco.png',
    cat: 'Banheiro',
    title: '',
    alt: 'Cozinha',
    desc: ''
  },

  {
    img: '../images/banheiro2.png',
    cat: 'Banheiro',
    title: '',
    alt: 'Banheiro',
    desc: ''
  },

  {
    img: '../images/banheiro.azul.png',
    cat: 'Banheiro',
    title: '',
    alt: 'Banheiro azul',
    desc: ''
  },

  {
    img: '../images/armário.cesto.png',
    cat: 'Banheiro',
    title: '',
    alt: 'Armário de banheiro',
    desc: ''
  },

  {
    img: '../images/banheiro.armário.png',
    cat: 'Banheiro',
    title: '',
    alt: 'Armário de banheiro',
    desc: ''
  },

  {
    img: '../images/lavanderia.png',
    cat: 'Lavanderia',
    title: '',
    alt: 'Lavanderia',
    desc: ''
  },

   {
    img: '../images/lavanderia.oa.png',
    cat: 'Lavanderia',
    title: '',
    alt: 'Lavanderia',
    desc: ''
  },


  {
    img: '../images/closet.png',
    cat: 'Quarto',
    title: '',
    alt: 'Closet de um quarto',
    desc: ''
  },

  {
    img: '../images/quarto.cabeceira.png',
    cat: 'Quarto',
    title: '',
    alt: 'Quarda-roupa azul',
    desc: ''
  },

  {
    img: '../images/cabeceira.cama.png',
    cat: 'Quarto',
    title: '',
    alt: 'Cabeceira de cama',
    desc: ''
  },

  
  {
    img: '../images/guarda-roupa.cabeceira.png',
    cat: 'Quarto',
    title: '',
    alt: 'Cabeceira de cama',
    desc: ''
  },

  {
    img: '../images/porta.gp.png',
    cat: 'Quarto',
    title: '',
    alt: 'Quarda-roupa azul',
    desc: ''
  },

  {
    img: '../images/guarda-roupa.c.png',
    cat: 'Quarto',
    title: '',
    alt: 'Quarda-roupa azul',
    desc: ''
  },

  {
    img: '../images/porta.c.png',
    cat: 'Quarto',
    title: '',
    alt: 'Quarda-roupa azul',
    desc: ''
  },

  {
    img: '../images/guarda-roupa.png',
    cat: 'Quarto',
    title: '',
    alt: 'Quarda-roupa azul',
    desc: ''
  },

  {
    img: '../images/cozinha.azul.png',
    cat: 'Cozinha',
    title: '',
    alt: 'Cozinha azul',
    desc: ''
  },

  {
    img: '../images/cozinha.azul2.png',
    cat: 'Cozinha',
    title: '',
    alt: 'Cozinha azul',
    desc: ''
  },

    {
    img: '../images/armário.verde.png',
    cat: 'Cozinha',
    title: '',
    alt: 'Armário verde',
    desc: ''
  },


  {
    img: '../images/tv.png',
    cat: 'Sala',
    title: '',
    alt: 'Sala',
    desc: ''
  },

  {
    img: '../images/sala.disco.png',
    cat: 'Sala',
    title: '',
    alt: 'Sala',
    desc: ''
  },

  {
    img: '../images/área.externa.png',
    cat: 'Área externa',
    title: '',
    alt: 'Área externa',
    desc: ''
  },
];

/* Ritmo visual da grade: repete a cada 6 projetos. */
const PROJECTS_LAYOUT = [
  { span: 'md:col-span-7', mt: '',         ratio: '4/3' },
  { span: 'md:col-span-5', mt: 'md:mt-4',  ratio: '3/4' },
  { span: 'md:col-span-4', mt: '',         ratio: '3/4' },
  { span: 'md:col-span-5', mt: 'md:mt-4',  ratio: '4/3' },
  { span: 'md:col-span-5', mt: '',         ratio: '4/3' },
  { span: 'md:col-span-7', mt: 'md:mt-4',  ratio: '4/3' },
];



