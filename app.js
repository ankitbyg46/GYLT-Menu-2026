const CONFIG={
  SHEET_ID:"1rzDtnYnKRoQ2tyWAsrMzApNNgGcbVNKUPzn8GdrJsOQ",
  MENU_SHEET:"Menu",
  SETTINGS_SHEET:"Settings",
  ASSETS_SHEET:"Assets",
  REFRESH_MINUTES:1
};

const state={rows:[],search:"",assets:{}};

const $=id=>document.getElementById(id);

const els={
  menu:$("menu"),
  status:$("status"),
  empty:$("empty"),
  nav:$("categoryNav"),

  searchToggle:$("searchToggle"),
  searchPanel:$("searchPanel"),
  searchInput:$("searchInput"),
  clearSearch:$("clearSearch"),

  gyltLogo:$("gyltLogo"),
  footerLogo:$("footerLogo"),

  heroTitle:$("heroTitle"),
  heroSubtitle:$("heroSubtitle"),
  reserveButton:$("reserveButton"),
  footerLocation:$("footerLocation"),

  eventSection:$("eventSection"),
  eventImage:$("eventImage"),
  eventDate:$("eventDate"),
  eventTitle:$("eventTitle"),
  eventMeta:$("eventMeta"),

  sponsorSection:$("sponsorSection"),
  sponsorLine:$("sponsorLine"),
  sponsorName:$("sponsorName"),
  sponsorLogo:$("sponsorLogo")
};

function text(v){
  return String(v??"").trim();
}

function norm(v){
  return text(v)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,"");
}

function yes(v){
  return v===true ||
    ["true","yes","1","y","checked"].includes(text(v).toLowerCase());
}

function slug(v){
  return text(v)
    .toLowerCase()
    .replace(/&/g,"and")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/(^-|-$)/g,"");
}

function money(v){
  if(v===""||v==null)return"";

  const n=Number(String(v).replace(/[₹,\s]/g,""));

  if(Number.isFinite(n)){
    return "₹ " +
      new Intl.NumberFormat("en-IN",{maximumFractionDigits:0}).format(n);
  }

  return "₹ "+text(v);
}

function gviz(sheet,callback){

  return `https://docs.google.com/spreadsheets/d/${encodeURIComponent(CONFIG.SHEET_ID)}/gviz/tq?sheet=${encodeURIComponent(sheet)}&headers=1&tqx=responseHandler:${callback}&cacheBust=${Date.now()}`;

}

function injectScript(id,src,onerror){

  document.getElementById(id)?.remove();

  const script=document.createElement("script");

  script.id=id;
  script.src=src;
  script.onerror=onerror;

  document.head.appendChild(script);
}


function assetUrl(value){

  const v=text(value);

  if(!v)return"";

  return state.assets[v] || v;
}


function loadAssets(){

  window.__gyltAssets=function(response){

    try{

      const assets={};

      response.table.rows.forEach(row=>{

        const key=text(row.c?.[0]?.v);

        const url=text(
          row.c?.[1]?.v ??
          row.c?.[1]?.f
        );

        if(key){
          assets[key]=url;
        }

      });

      state.assets=assets;

      loadSettings();

    }catch(error){

      console.error("Assets error:",error);

      loadSettings();

    }

  };

  injectScript(
    "asset-source",
    gviz(CONFIG.ASSETS_SHEET,"__gyltAssets"),
    ()=>loadSettings()
  );

}


function loadSettings(){

  window.__gyltSettings=function(response){

    try{

      if(response?.status==="error"){
        throw new Error("Settings sheet unavailable");
      }

      const settings={};

      response.table.rows.forEach(row=>{

        const key=text(row.c?.[0]?.v);

        const value=
          row.c?.[1]?.v ??
          row.c?.[1]?.f ??
          "";

        if(key){
          settings[key]=value;
        }

      });

      applySettings(settings);

    }catch(error){

      console.error("Settings error:",error);

    }

  };

  injectScript(
    "settings-source",
    gviz(CONFIG.SETTINGS_SHEET,"__gyltSettings"),
    ()=>console.error("Settings unavailable")
  );

}


function applySettings(settings){

  const logo=assetUrl(settings["GYLT Logo"]);

  if(logo){

    els.gyltLogo.src=logo;
    els.gyltLogo.classList.remove("hidden");
    els.gyltWordmark.classList.add("hidden");

    els.footerLogo.src=logo;
    els.footerLogo.classList.remove("hidden");

  }


  if(settings["Hero Title"]){

    els.heroTitle.innerHTML=text(settings["Hero Title"]);

  }

  if(settings["Hero Subtitle"]){

    els.heroSubtitle.textContent=text(settings["Hero Subtitle"]);

  }


  els.footerLocation.textContent=
    text(settings["Footer Location"]) ||
    "BENGALURU";


  const reserveUrl=text(settings["Reserve URL"]);

  if(reserveUrl){

    els.reserveButton.href=reserveUrl;

    els.reserveButton.classList.remove("hidden");

  }else{

    els.reserveButton.classList.add("hidden");

  }


  if(yes(settings["Event Active"])){

    els.eventSection.classList.remove("hidden");

    els.eventTitle.textContent=
      text(settings["Event Title"]);

    els.eventDate.textContent=
      text(settings["Event Date"]);

    els.eventMeta.textContent=
      text(settings["Event Meta"]);


    const eventImage=
      assetUrl(settings["Event Image"]);

    if(eventImage){

      els.eventImage.src=eventImage;

      els.eventImage.alt=
        text(settings["Event Title"]);

      els.eventImage.classList.remove("hidden");

    }else{

      els.eventImage.classList.add("hidden");

    }

  }else{

    els.eventSection.classList.add("hidden");

  }


  if(yes(settings["Sponsor Active"])){

    els.sponsorSection.classList.remove("hidden");

    els.sponsorLine.textContent=
      text(settings["Sponsor Line"]) ||
      "EXCLUSIVE POURS";

    els.sponsorName.textContent=
      text(settings["Sponsor Name"]);


    const sponsorLogo=
      assetUrl(
        settings["Sponsor Asset Key"] ||
        settings["Sponsor Logo"]
      );

    if(sponsorLogo){

      els.sponsorLogo.src=sponsorLogo;

      els.sponsorLogo.alt=
        text(settings["Sponsor Name"]);

      els.sponsorLogo.classList.remove("hidden");

    }else{

      els.sponsorLogo.classList.add("hidden");

    }

  }else{

    els.sponsorSection.classList.add("hidden");

  }

}


function loadMenu(){

  if(
    !CONFIG.SHEET_ID ||
    CONFIG.SHEET_ID==="PASTE_YOUR_GOOGLE_SHEET_ID"
  ){

    els.status.innerHTML=
      "Add your Google Sheet ID in <strong>app.js</strong>.";

    return;
  }


  window.__gyltMenu=function(response){

    try{

      if(response?.status==="error"){

        throw new Error("Menu sheet unavailable");

      }

      state.rows=parseMenu(response);

      render();

    }catch(error){

      console.error(error);

      els.status.innerHTML=
        "Menu could not load.<br>Check sheet sharing and tab names.";

    }

  };


  injectScript(
    "menu-source",
    gviz(CONFIG.MENU_SHEET,"__gyltMenu"),
    ()=>{

      els.status.innerHTML=
        "Menu could not load.<br>Check Google Sheet sharing.";

    }
  );

}


function parseMenu(response){

  const columns=
    response.table.cols.map(
      column=>norm(column.label)
    );


  const findIndex=(...names)=>{

    for(const name of names){

      const index=
        columns.indexOf(norm(name));

      if(index!==-1){
        return index;
      }

    }

    return -1;
  };


  const index={

    category:findIndex("Category"),

    brand:findIndex("Brand"),

    product:findIndex(
      "Product",
      "Product Name"
    ),

    serving:findIndex("Serving"),

    price:findIndex("Price"),

    portfolio:findIndex("Portfolio"),

    active:findIndex("Active"),

    order:findIndex("Order"),

    featured:findIndex("Featured"),

    soldOut:findIndex(
      "Sold Out",
      "SoldOut"
    ),

    description:findIndex("Description"),

    categoryOrder:findIndex(
      "Category Order",
      "CategoryOrder"
    )

  };


  const required=[
    "category",
    "product",
    "price",
    "active"
  ];


  if(
    required.some(
      key=>index[key]===-1
    )
  ){

    throw new Error(
      "Required menu columns are missing"
    );

  }


  const rows=[];


  response.table.rows.forEach(
    (row,rowIndex)=>{

      const cell=i=>{

        if(
          i===-1 ||
          !row.c?.[i]
        ){
          return "";
        }

        return (
          row.c[i].v ??
          row.c[i].f ??
          ""
        );

      };


      if(
        !yes(
          cell(index.active)
        )
      ){
        return;
      }


      rows.push({

        category:
          text(
            cell(index.category)
          ),

        brand:
          text(
            cell(index.brand)
          ),

        product:
          text(
            cell(index.product)
          ),

        serving:
          text(
            cell(index.serving)
          ),

        price:
          cell(index.price),

        portfolio:
          text(
            cell(index.portfolio)
          ),

        order:
          Number(
            cell(index.order)
          ) || 9999,

        featured:
          yes(
            cell(index.featured)
          ),

        soldOut:
          yes(
            cell(index.soldOut)
          ),

        description:
          text(
            cell(index.description)
          ),

        categoryOrder:
          Number(
            cell(index.categoryOrder)
          ) || 9999,

        rowIndex

      });

    }
  );


  return rows.filter(
    row=>
      row.category &&
      row.product
  );

}


function groupRows(rows){

  const groups=new Map();


  rows.forEach(row=>{

    if(
      !groups.has(row.category)
    ){

      groups.set(
        row.category,
        {
          name:row.category,
          order:row.categoryOrder,
          first:row.rowIndex,
          items:[]
        }
      );

    }


    const group=
      groups.get(row.category);


    group.order=
      Math.min(
        group.order,
        row.categoryOrder
      );


    group.first=
      Math.min(
        group.first,
        row.rowIndex
      );


    group.items.push(row);

  });


  return [...groups.values()]

    .sort(
      (a,b)=>
        (a.order-b.order) ||
        (a.first-b.first)
    )

    .map(group=>({

      ...group,

      items:
        group.items.sort(
          (a,b)=>
            (a.order-b.order) ||
            (a.rowIndex-b.rowIndex)
        )

    }));

}


function render(){

  els.status.classList.add("hidden");


  const query=
    state.search
      .trim()
      .toLowerCase();


  const filtered=
    !query
      ? state.rows
      : state.rows.filter(row=>

          [
            row.category,
            row.brand,
            row.product,
            row.serving,
            row.portfolio,
            row.description
          ]

          .join(" ")

          .toLowerCase()

          .includes(query)

        );


  const groups=
    groupRows(filtered);


  els.menu.innerHTML="";
  els.nav.innerHTML="";


  if(!groups.length){

    els.empty.classList.remove("hidden");

    return;

  }


  els.empty.classList.add("hidden");


  groups.forEach(
    (group,groupIndex)=>{

      const id=
        "category-" +
        slug(group.name) +
        "-" +
        groupIndex;


      const navButton=
        document.createElement("button");

      navButton.type="button";

      navButton.className="nav-pill";

      navButton.textContent=
        group.name.toUpperCase();


      navButton.addEventListener(
        "click",
        ()=>{

          document
            .getElementById(id)
            ?.scrollIntoView({
              behavior:"smooth",
              block:"start"
            });

        }
      );


      els.nav.appendChild(navButton);


      const section=
        document.createElement("section");

      section.className=
        "menu-section";

      section.id=id;


      const heading=
        document.createElement("div");

      heading.className=
        "category-heading";


      const h2=
        document.createElement("h2");

      h2.textContent=
        group.name.toUpperCase();


      const line=
        document.createElement("div");

      line.className=
        "category-line";


      const count=
        document.createElement("div");

      count.className=
        "category-count";

      count.textContent=
        String(
          group.items.length
        ).padStart(2,"0");


      heading.append(
        h2,
        line,
        count
      );


      section.appendChild(heading);


      group.items.forEach(item=>{

        const row=
          document.createElement("article");


        row.className=
          "menu-item" +
          (
            item.soldOut
              ? " sold-out"
              : ""
          );


        const main=
          document.createElement("div");


        if(item.brand){

          const brand=
            document.createElement("div");

          brand.className=
            "item-brand";

          brand.textContent=
            item.brand;

          main.appendChild(brand);

        }


        const product=
          document.createElement("div");

        product.className=
          "item-name";

        product.textContent=
          item.product;

        main.appendChild(product);


        const metaParts=[];


        if(item.description){

          metaParts.push(
            item.description
          );

        }


        if(item.serving){

          metaParts.push(
            item.serving.toUpperCase()
          );

        }


        if(
          metaParts.length ||
          item.soldOut
        ){

          const meta=
            document.createElement("div");

          meta.className=
            "item-meta";

          meta.textContent=
            item.soldOut
              ? "Currently unavailable"
              : metaParts.join(" · ");

          main.appendChild(meta);

        }


        const price=
          document.createElement("div");

        price.className=
          "item-price";

        price.textContent=
          item.soldOut
            ? "—"
            : money(item.price);


        row.append(
          main,
          price
        );


        if(item.featured){

          const badges=
            document.createElement("div");

          badges.className=
            "item-badges";


          const badge=
            document.createElement("span");

          badge.className=
            "badge";

          badge.textContent=
            "GYLT SELECT";


          badges.appendChild(badge);

          row.appendChild(badges);

        }


        section.appendChild(row);

      });


      els.menu.appendChild(section);

    }
  );


  observeSections();

}


function observeSections(){

  const sections=
    [
      ...document.querySelectorAll(
        ".menu-section"
      )
    ];


  const pills=
    [
      ...document.querySelectorAll(
        ".nav-pill"
      )
    ];


  if(!sections.length){
    return;
  }


  const observer=
    new IntersectionObserver(
      entries=>{

        const visible=
          entries

            .filter(
              entry=>entry.isIntersecting
            )

            .sort(
              (a,b)=>
                b.intersectionRatio -
                a.intersectionRatio
            )[0];


        if(!visible){
          return;
        }


        const index=
          sections.indexOf(
            visible.target
          );


        pills.forEach(
          (pill,pillIndex)=>{

            pill.classList.toggle(
              "active",
              pillIndex===index
            );

          }
        );


        pills[index]
          ?.scrollIntoView({
            behavior:"smooth",
            inline:"center",
            block:"nearest"
          });

      },
      {
        rootMargin:
          "-22% 0px -65% 0px",

        threshold:[
          0,
          .1,
          .3
        ]
      }
    );


  sections.forEach(
    section=>
      observer.observe(section)
  );

}


els.searchToggle.addEventListener(
  "click",
  ()=>{

    els.searchPanel
      .classList
      .toggle("hidden");


    if(
      !els.searchPanel
        .classList
        .contains("hidden")
    ){

      els.searchInput.focus();

    }

  }
);


els.searchInput.addEventListener(
  "input",
  event=>{

    state.search=
      event.target.value;

    render();

  }
);


els.clearSearch.addEventListener(
  "click",
  ()=>{

    state.search="";

    els.searchInput.value="";

    render();

    els.searchInput.focus();

  }
);


loadAssets();

loadMenu();


setInterval(
  ()=>{

    loadAssets();

    loadMenu();

  },
  Math.max(
    1,
    CONFIG.REFRESH_MINUTES
  ) *
  60 *
  1000
);
