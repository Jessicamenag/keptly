# Keptly

Cuidar también es una forma de querer.

Keptly es una web app mobile-first: elegís una flor (rosa, tulipán o girasol), la sembrás, la regás, le das sol y le hablás. Cuando florece, la mandás en su maceta personalizada, con una tarjeta hecha a mano, a alguien que querés.

- Cada especie tiene 10 variantes de floración ocultas: no sabés cuál te va a tocar hasta que se abre.
- Se puede enfermar (hongos) y se puede morir.
- La maceta y la tarjeta se personalizan con colores, patrones y dibujo a mano.
- El regalo viaja dentro del link: no se guarda nada en ningún servidor.

Diseño: Jessica Mena · [jessicamena.com](https://jessicamena.com)

## Cómo verla

Es un sitio estático. Abrí `index.html` desde un servidor local, por ejemplo:

```
python3 -m http.server 8000
```

y entrá a `http://localhost:8000`.

Para publicarla con GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.

## Estructura

- `index.html`: la app ya armada (es la que se publica).
- `src/`: las fuentes (`a_css.html`, `b_body.html`, `c1.js`, `c2.js`, `c3.js`).
- `img/`: sprites de las flores, variantes, semillas, macetas y fondos.
- `build.py`: une `src/` en `index.html`.

```
python3 build.py
```
