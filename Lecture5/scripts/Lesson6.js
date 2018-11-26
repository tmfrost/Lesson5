;var ProgModule = (function() {
    var public = {};

Junior = function (name) {
    this.name = name;
    this.level = this.constructor.name;
    this.lines = 100;
    this.zarplata = 10;
};
    Junior.prototype.write = function() {
   // alert("("+this.level + ") " + this.name + " " + "написал " + this.lines + " строк.");
   // document.getElementById("free_devs").innerHTML += ("("+this.level + ") " + this.name + " ");
    }
  
    public.Junior = Junior;

Middle = function(name) {
    Junior.apply(this, arguments);
    this.lines = 300;
    this.zarplata = 30;
};

    Middle.prototype = Object.create(Junior.prototype);
    Middle.prototype.constructor = Middle;

    public.Middle = Middle;

Senior = function(name) {
    Junior.apply(this, arguments);
    this.lines = 500;
    this.zarplata = 50;
};

    Senior.prototype = Object.create(Junior.prototype);
    Senior.prototype.constructor = Senior;

    public.Senior = Senior;

return public;
}
)();


;var MngModule = (function() {
    return {
        Manager: function(name, exp) {
            this.name = name;
            this.zarplata = exp*100;
            this.exp = exp;
        },
    }
}
)();


;var ProjModule = (function() {
    return {
    Project: function(name, cost, lines) {
        this.name = name;
        this.cost = cost;
        this.lines = lines;
    }
   }
}
)();

//------------------------------------------------------------------------------------------
;var MainModule = (function() {
    var publicMain = {};

    var dev1; var input; var publicId; var publicPole; var timerId; var onStart = false; onStop = true;
    var people = {};
    var count = 0;
    var sumDevStrok = 0; var sumDevZar = 0;
    var sumManExp = 1; var sumManZar = 0;
    var projectLines = 0; cacheLines = 0; var projectOn = false; publicProjCost = 0;

    function addBtnDel(obj, pole){
        publicPole = pole;
        people[count] = obj;
        count++;
        console.log(people);
   //   console.log(people[count-1]);

        var elem = document.getElementById(pole);
            input = document.createElement("input");
            input.id = ([count-1]);
            publicId = parseFloat(input.id);
            input.type = "button";
            input.value = "Remove";    

            human = document.createElement("div");
            human.id = String(publicId);
            if(publicPole === "free_devs"){
                human.innerHTML = ("("+obj.level + ") " + obj.name + " ");
            }
            if(publicPole === "free_managers"){
                human.innerHTML = (obj.name + " (x"+obj.exp +")");
            }
        
            input.setAttribute('onclick', "MainModule.delPeople("+ publicId+", "+ human.id +");");

        elem.appendChild(human);
        elem.appendChild(input);
      //  document.getElementById("free_devs").innerHTML += ("<hr/>")
    }
    publicMain.people = people;


    function delPeople(newId, hId){
        var myDiv = document.getElementById(newId);
        myDiv.parentNode.removeChild(myDiv);
        var myDiv2 = document.getElementById(hId);
        myDiv2.parentNode.removeChild(myDiv2);
    
        if(publicPole === "free_devs"){
            sumDevZar -= people[newId].zarplata;
            sumDevStrok -= people[newId].lines;
        }
        if(publicPole === "free_managers"){
            sumManExp -= people[newId].exp;
            sumManZar -= people[newId].zarplata;
        }
    
    }
    publicMain.delPeople = delPeople;


    function addDev(){ 
        var devName = document.getElementById("developer-name").value;
        var devLevel = document.querySelector('input[name = "dev-level"]:checked').value;
        if(devLevel == "Junior"){
            dev1 = new ProgModule.Junior(devName); 
        }
        else if(devLevel == "Middle"){
            dev1 = new ProgModule.Middle(devName);
        }
        else if(devLevel == "Senior"){
            dev1 = new ProgModule.Senior(devName);
        }
    //    dev1.write();
        sumDevStrok += dev1.lines;
        sumDevZar += dev1.zarplata;

        //document.getElementById("free_devs").innerHTML += ("("+developers[count-1].level + ") " + developers[count-1].name + " ");
        addBtnDel(dev1, "free_devs");
        console.log(sumDevZar);

    }
    btn_add_dev.addEventListener("click", addDev);


    function addManager(){
        var man1;  
        var manName = document.getElementById("manager-name").value;
        var manExp = document.getElementById("manager-exp").value;
        
        man1 = new MngModule.Manager(manName, manExp);
        addBtnDel(man1, "free_managers");
      //  document.getElementById("free_managers").innerHTML += (man1.name + " x" + man1.exp + "<hr/>");
        sumManExp += parseFloat(manExp);
        sumManZar += man1.zarplata;
        console.log(sumManExp);
    }
    
        btn_add_manager.addEventListener("click", addManager);


    function addProject(){
        if(projectOn == false){
            var proj1;  
            var projName = document.getElementById("project-name").value;
            var projCost = document.getElementById("project-cost").value;
            var projLines = document.getElementById("project-lines").value;
            
            proj1 = new ProjModule.Project(projName, projCost, projLines);
            document.getElementById("projects_list").innerHTML = (proj1.name + " ("+proj1.cost + "$) " + " [" + projLines + " строк]");
            projectLines = parseFloat(proj1.lines);
            console.log(projectLines);
            publicProjCost = parseFloat(proj1.cost);
        }
        projectOn = true;
    }
        btn_add_project.addEventListener("click", addProject);


        function doForInterval() {
            document.getElementById("timer").innerHTML++;
            if (cacheLines < projectLines && projectOn){
            cacheLines += (parseFloat(sumDevStrok)*parseFloat(sumManExp));
            document.getElementById("projects_list").innerHTML = ("Готов на: " + cacheLines + "");
            document.getElementById("budget_value").innerHTML -= (sumDevZar + sumManZar); 
            }
            if(cacheLines >= projectLines && projectOn){
                document.getElementById("projects_list").innerHTML = ("Проект завершен. <hr/>");
                cacheLines = 0;
                document.getElementById("budget_value").innerHTML = parseFloat(document.getElementById("budget_value").innerHTML) + parseFloat(publicProjCost);
                projectOn = false;
            }
            if(parseFloat(document.getElementById("budget_value").innerHTML) <= 0){
                clearInterval(timerId);  
                document.getElementById("budget_value").innerHTML += " - вы проиграли.";
            }
        }

        
        function startGame(){
           if(onStart === false && onStop === true){
                document.getElementById("timer").innerHTML = 1;
                document.getElementById("budget_value").innerHTML = parseFloat(document.getElementById("company-budget").value);
                timerId = setInterval(doForInterval, 1000);
                onStart = true;
                onStop = false;
           }

        }
        btn_start.addEventListener("click", startGame)


        function stopGame(){
                clearInterval(timerId);
                onStop = true;
                onStart = false;
            }
        btn_stop.addEventListener("click", stopGame)

        return publicMain;
}
)();


