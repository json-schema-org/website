---
title: "Transformando la industria de la contratación técnica con JSON Schema"
date: "2024-02-05"
type: Case Study
cover: /img/posts/2024/manfred-case-study/background.webp
authors:
  - name: Benjamin Granados
    photo: /img/avatars/benjagm.webp
    twitter: benjagm
    byline: DevRel & Community Program Manager @Postman
  - name: Yeray Darias
    photo: /img/avatars/yeray.webp
    twitter: ydarias
    byline: Lead Software Engineer
excerpt: "Descubre cómo Manfred ha usado JSON Schema para transformar la industria de la contratación técnica."
---
[Manfred](https://www.getmanfred.com/) es una plataforma de gestión de talento tecnológico con sede en España que permite a sus usuarios gestionar sus carreras profesionales manteniendo un control absoluto sobre sus datos. Manfred ha sido creada por desarrolladores para desarrolladores, liderando un cambio de paradigma en la industria de contratación técnica. Este case study muestra cómo Manfred utilizó JSON Schema para potenciar la transparencia, empoderar a los desarrolladores y fomentar la interoperabilidad dentro del ecosistema de reclutamiento tecnológico.

## Reto
Manfred inició su andadura con la ambiciosa misión de revolucionar el panorama de reclutamiento y para ello decidió apostar por la transparencia total y una estrategia Open Data. Las plataformas de reclutamiento tradicionales se han caracterizado por ofrecer un acceso limitado a los datos personales, a menudo proporcionando archivos poco accionables como PDFs. Manfred apostó por ofrecer una propuesta de valor única ofreciendo una solución que empoderara a los desarrolladores para poseer sus datos en el formato de intercambio universal: JSON.

<div className="text-2xl my-5 mx-8 border-gray-300 bg-gray-300 p-4 p-t-6 text-center">
  _"Mientras que otras plataformas de recruiting se basan en la captura de tus datos para luego entregarlos en formatos poco interoperables como PDF, nuestra propuesta fue completamente diferente. Tus datos son tuyos y en JSON, el estándar de facto." - **David Bonilla** - Founder_
</div>

<div className='flex flex-wrap justify-center items-center gap-4 w-full'>
    <img className='w-full md:w-full lg:w-3/5 xl:w-3/5 2xl:w-3/5 px-20' src='/img/posts/2024/manfred-case-study/period.webp'/>
</div>

## Solution
Reconociendo la necesidad de un enfoque developer-friendly, Manfred apostó por JSON Schema como la piedra angular de su plataforma al crear el [MAC](https://github.com/getmanfred/mac), un formato estándar y open source para definir y compartir currículums. Al ofrecer a los desarrolladores sus datos en formato JSON ofreciendo además el JSON Schema (el MAC) como el mapa para usarlo, Manfred transformó la forma en que los profesionales interactuaban con su propia información. Este enfoque innovador no sólo permitió a Manfred diferenciarse de sus competidores, sino que también propició un nuevo nivel de transparencia en los procesos de contratación al ofrecer un enfoque basado en datos estructurados y accionables con enormes capacidades de interoperabilidad.

<div className="text-2xl my-5 mx-8 border-gray-300 bg-gray-300 p-4 p-t-6">
  _"Tras probar diferentes formatos, descubrimos que usando JSON junto a JSON Schema tendríamos la flexibilidad de poder hacer prácticamente cualquier cosa." - **David Bonilla** - Founder_
</div>

<div className='flex flex-wrap justify-center items-center gap-4 w-full'>
    <img className='w-full md:w-full lg:w-3/5 xl:w-3/5 2xl:w-3/5 px-20 pt-10' src='/img/posts/2024/manfred-case-study/MAC_Structure.webp'/>
</div>

## Impacto
La adopción de JSON Schema tuvo un impacto profundo en la estrategia de Manfred, contribuyendo a la transparencia, flexibilidad y escalabilidad de la plataforma. A diferencia de las plataformas convencionales que proporcionan datos estáticos y poco accionables, Manfred empoderó a los desarrolladores para utilizar sus propios datos de manera efectiva. La adopción de JSON Schema afectó muy positivamente en distintas áreas:

* **Transparencia y Accesibilidad**: El compromiso de Manfred con los datos abiertos sumado al uso de JSON Schema permitió a los desarrolladores acceder, comprender y navegar sus datos profesionales de una manera fácil e intuitiva. Esta transparencia se convirtió en un factor clave de la confianza entre Manfred y la comunidad.
* **Comunidad**: El uso de JSON Schema por parte de Manfred fue percibido positivamente por la comunidad de desarrolladores, fortaleciendo su posición como una plataforma que pone a los desarrolladores en el centro.
* **Ventaja competitiva**: La propuesta de valor única de proporcionar datos accionables en formato JSON diferenció a Manfred en una industria muy competitiva. Los desarrolladores ahora podían aprovechar el poder de sus propios datos, tomando mejores decisiones sobre sus carreras.
* **Flexibilidad y Escalabilidad**: JSON Schema proporcionó la flexibilidad necesaria para adaptarse a las necesidades de una industria cambiante y facilitando un crecimiento más rápido de la base de usuarios. 

<div className='flex flex-wrap justify-center items-center gap-4 w-full'>
    <img className='w-full md:w-full lg:w-3/5 xl:w-3/5 2xl:w-3/5 px-20' src='/img/posts/2024/manfred-case-study/MAC_Export.webp'/>
</div>

## Resultados clave
La adopción de JSON Schema permitió que partners y 3rd parties se integraran con la plataforma de manera más fácil y rápida. La validación e intercambio de información entre Manfred y sus partners se convirtió en un proceso trivial.

<div className="text-2xl my-5 mx-8 border-gray-300 bg-gray-300 p-4 p-t-6 text-center mb-20">
  _“Usar JSON Schema demostró ser una decisión clave para que la plataforma fuera lo suficientemente flexible y escalable como para soportar al crecimiento de la Empresa.” - **David Bonilla** - Founder_
</div>

## Sobre Manfred
En sus propias palabras: 

<p>“Manfred es una empresa de reclutamiento. Bueno, para ser justos, es una empresa que nació para cambiar el reclutamiento, ayudando a la comunidad con procesos más estructurados y transparentes y un enfoque basado en las personas.</p>

<p>Ayudamos a las personas a alcanzar sus metas profesionales conectando individuos y empresas que comparten objetivos, valores e intereses. Buscamos, entrevistamos, asesoramos y presentamos perfiles tecnológicos a empresas. Pero nuestra misión va más allá: buscamos ayudarlos a lo largo de su trayectoria profesional. Estamos allí, independientemente de la etapa en la que te encuentres, ya sea que estés buscando activamente un trabajo o no, ya sea que necesites consejos o no estés seguro de cómo reorientar tu carrera.</p>

<p>Nuestra prioridad siempre han sido las personas. Nuestro objetivo es devolver a todos los desarrolladores lo que no nos han dado. Formamos parte de una comunidad abierta y colaborativa, pero tiene un problema: la adquisición y gestión de talento.</p> 

<p>No movemos cajas, no movemos recursos. <del>Movemos</del>Ayudamos a las personas.”</p>

<div className='flex flex-wrap justify-center items-center gap-4 w-full'>
    <img className='w-full md:w-full lg:w-3/5 xl:w-3/5 2xl:w-3/5 px-20 pt-10 pb-20' src='/img/posts/2024/manfred-case-study/manfred_team.webp' alt='image'/>
</div>