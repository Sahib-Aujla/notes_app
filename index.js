let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let addDisplay = false;
let textArea = document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
let removeFlag = false;
let toolBoxColors = document.querySelectorAll(".color")


let colors = ["lightpink", "lightgreen", "lightblue", "black"];
let modalPriorityColor = colors[colors.length - 1];
let LockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketArr = [];
if (localStorage.getItem("Jira_Ticket")) {
    //retrieve data and display that
    ticketArr = JSON.parse(localStorage.getItem("Jira_Ticket"));
    ticketArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}

for (let i = 0; i < toolBoxColors.length; i++) {

    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })
        //remove prevvious tickets first
        let allTicketCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketCont.length; i++) {
            allTicketCont[i].remove();

        }

        //display filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);

        })

    })


    toolBoxColors[i].addEventListener("dblclick", (e) => {
        let allTicketCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketCont.length; i++) {
            allTicketCont[i].remove();

        }
        ticketArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })

    })

}

addBtn.addEventListener("click", (e) => {

    addDisplay = !addDisplay;
    if (addDisplay===true) {
        modalCont.style.display = 'flex';
    } else {
        modalCont.style.display = 'none';
    }
})

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    // removeTicket(ticketCont);


})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textArea.value);
        addDisplay = false;
        // modalCont.style.display = 'none';
        // textArea.value = "";
        setModalToDefault();

    }
})
function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
   
    <div class="ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="taskarea">${ticketTask}</div>
    <div class="ticket-lock"><i class="fa-solid fa-lock"></i></div>

</div>
`;
    mainCont.appendChild(ticketCont);


    //create ticket of object and add to array
    if (!ticketID) {
        ticketArr.push({ ticketColor, ticketTask, ticketID: id });
        localStorage.setItem("Jira_Ticket", JSON.stringify(ticketArr));
    }

    handleRemoval(ticketCont, id);
    handleLock(ticketCont, id);
    handleColor(ticketCont, id);
}


allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    })
})

function handleRemoval(ticket, id) {

    ticket.addEventListener("click", (e) => {
        if (!removeFlag) {
            return

        }
        // DB removal
        let idx = getTicketIdx(id);
        ticketArr.splice(idx, 1);
        let strTicketsArr=JSON.stringify(ticketArr);
        localStorage.setItem("Jira_Ticket",strTicketsArr );

        ticket.remove();//UI removal


    })


}

function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".taskarea");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        if (ticketLock.classList.contains(LockClass)) {
            ticketLock.classList.remove(LockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        }
        else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(LockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");

        }

        // modify data 
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("Jira_Ticket", JSON.stringify(ticketArr));
    })
}

function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        let currentTicketColor = ticketColor.classList[1];
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);

        //modify data in local storage(color change)
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("Jira_Ticket", JSON.stringify(ticketArr));
    })
}

function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}

function setModalToDefault() {
    modalCont.style.display = 'none';
    textArea.value = "";
    modalPriorityColor = colors[colors.length - 1];
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length - 1].classList.add("border");
}