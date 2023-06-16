import { useState, useEffect } from "react";
import Axios from "axios";
import config from "../config";
import "./App.css";

export const App = () => {
  const [orders, setOrders] = useState({});
  const [pizzas, setPizzas] = useState({});
  const [others, setOthers] = useState({});
  const [deals, setDeals] = useState();
  const [hours, setHours] = useState();
  const [drinks, setDrinks] = useState();
  const [desserts, setDesserts] = useState();
  const [page, setPage] = useState(0);
  const [inventoryAddNumber, setInventoryAddNumber] = useState(0);
  const [changeOpenTime, setChangeOpenTime] = useState("11:00:00");
  const [changeCloseTime, setChangeCloseTime] = useState("21:00:00");
  const [changeNoticeHours, setChangeNoticeHours] = useState("");

  const getOrders = () => {
    Axios.get(
      config //orders
    )
      .then((response) => {
        let orderCollection = response.data;
        setOrders(orderCollection);
        let orderCheckoutsParsed = orderCollection.map((order) => {
          return JSON.parse(order["orderCheckout"]);
        });
        setPizzas(orderCheckoutsParsed);
        let otherOrdersParsed = orderCollection.map((order) => {
          return JSON.parse(order["otherorders"]);
        });
        setOthers(otherOrdersParsed);
      })
      .catch((error) => console.log(error));
  };

  const getDeals = () => {
    Axios.get(
      config //promos"
    )
      .then((response) => {
        let serveDeals = response.data;
        setDeals(serveDeals);
        console.log(serveDeals);
      })
      .catch((error) => console.log(error));
  };

  const getHours = () => {
    Axios.get(
      config //hours"
    )
      .then((response) => {
        let serveHours = response.data;
        setHours(serveHours);
        console.log(serveHours);
      })
      .catch((error) => console.log(error));
  };

  const getDrinks = () => {
    Axios.get(
      config //drinkInventory"
    )
      .then((response) => {
        let serveDrinks = response.data;
        setDrinks(serveDrinks);
        // console.log(serveDrinks)
      })
      .catch((error) => console.log(error));
  };
  const getDesserts = () => {
    Axios.get(
      config //dessertInventory"
    )
      .then((response) => {
        let serveDesserts = response.data;
        setDesserts(serveDesserts);
        // console.log(serveDesserts)
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getDeals();
    getOrders();
    getDrinks();
    getDesserts();
    getHours();
    const interval = setInterval(() => {
      getDrinks();
      getDesserts();
      getOrders();
      getHours();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const orderStatus = (statusNumber) => {
    const status = {
      1: "WAITING",
      2: "CREATING",
      3: "IN THE OVEN",
      4: "READY",
      5: "PICKED UP",
    };
    return status[statusNumber] || "STATUS ERROR";
  };
  const promoStatus = (statusNumber) => {
    const status = {
      1: "ACTIVE",
      2: "INACTIVE",
    };
    return status[statusNumber] || "STATUS ERROR";
  };

  const statusAndID = (e) => {
    let id = e.target.id;
    return `UPDATE orders set orderstatus = orderStatus + 1 where order_id = ${id};`;
  };
  const promoStatusAndID = (e, status) => {
    let id = e.target.id;
    // let active = status;
    console.log(status);
    if (status === 1) {
      return `UPDATE deals set deal_active = 2 where deals_id = ${id};`;
    } else {
      return `UPDATE deals set deal_active = 1 where deals_id = ${id};`;
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleOrderStatus = (e) => {
    const updateStatus = {
      status: statusAndID(e),
    };
    Axios.post(
      config, //updateStatus"
      updateStatus
    ).then(async () => {
      await delay(500);
      getOrders();
    });
  };

  const handlePromoStatus = (e, status) => {
    const updatePromoStatus = {
      status: promoStatusAndID(e, status),
    };
    Axios.post(
      config, //updatePromoStatus"
      updatePromoStatus
    ).then(async () => {
      await delay(500);
      getDeals();
    });
  };

  const closedStatus = (statusNumber) => {
    const status = {
      0: "OPEN",
      1: "CLOSED",
    };
    return status[statusNumber] || "STATUS ERROR";
  };

  const closedStatusAndID = (e, status) => {
    let id = e.target.id;
    // let active = status;
    console.log(status);
    if (status === 0) {
      return `UPDATE hours set closed = 1 where hours_id = ${id};`;
    } else {
      return `UPDATE hours set closed = 0 where hours_id = ${id};`;
    }
  };

  const handleClosedStatus = (e, status) => {
    const updateClosedStatus = {
      status: closedStatusAndID(e, status),
    };
    Axios.post(
      config, //updateHours"
      updateClosedStatus
    ).then(async () => {
      await delay(500);
      getHours();
    });
  };

  const hoursUpdateOpen = (e, hour) => {
    let id = hours[hour]["hours_id"];
    let timeChange = changeOpenTime;
    return `UPDATE hours set openTime = "${timeChange}" where hours_id = ${id};`;
  };

  const handleUpdateOpenHours = (e, hour) => {
    e.preventDefault(e);
    const updateHours = {
      status: hoursUpdateOpen(e, hour),
    };
    Axios.post(
      config, //updateHours"
      updateHours
    ).then(async () => {
      await delay(500);
      getHours();
    });
  };

  const hoursUpdateClose = (e, hour) => {
    let id = hours[hour]["hours_id"];
    let timeClosed = changeCloseTime;
    return `UPDATE hours set closeTime = "${timeClosed}" where hours_id = ${id};`;
  };

  const handleUpdateCloseHours = (e, hour) => {
    e.preventDefault(e);
    const updateClose = {
      status: hoursUpdateClose(e, hour),
    };
    Axios.post(
      config, //updateHours"
      updateClose
    ).then(async () => {
      await delay(500);
      getHours();
    });
  };

  const hoursUpdateNotice = (e, hour) => {
    let id = hours[hour]["hours_id"];
    let closedNotice = changeNoticeHours;
    return `UPDATE hours set closedNotice = "${closedNotice}" where hours_id = ${id};`;
  };

  const handleUpdateNoticeHours = (e, hour) => {
    e.preventDefault(e);
    const updateNotice = {
      status: hoursUpdateNotice(e, hour),
    };
    Axios.post(
      config, //updateHours"
      updateNotice
    ).then(async () => {
      await delay(500);
      getHours();
    });
  };

  const drinksUpdateStatus = (e, drink) => {
    let id = drinks[drink]["drink_id"];
    let addAmount = inventoryAddNumber;
    return `UPDATE drinks set inventory = inventory + ${addAmount} where drink_id = ${id};`;
  };

  const handleUpdateDrinks = (e, drink) => {
    e.preventDefault(e);
    const updateDrinks = {
      status: drinksUpdateStatus(e, drink),
    };
    Axios.post(
      config, //updateDrinks"
      updateDrinks
    ).then(async () => {
      await delay(500);
      getDrinks();
    });
  };

  const dessertsUpdateStatus = (e, dessert) => {
    let id = desserts[dessert]["dessert_id"];
    let addAmount = inventoryAddNumber;
    return `UPDATE desserts set inventory = inventory + ${addAmount} where dessert_id = ${id};`;
  };

  const handleUpdateDesserts = (e, dessert) => {
    e.preventDefault(e);
    const updateDesserts = {
      status: dessertsUpdateStatus(e, dessert),
    };
    Axios.post(
      config, //updateDesserts"
      updateDesserts
    ).then(async () => {
      await delay(500);
      getDesserts();
    });
  };

  const weekday = (day) => {
    const theDay = {
      1: "Sunday",
      2: "Monday",
      3: "Tuesday",
      4: "Wednesday",
      5: "Thusday",
      6: "Friday",
      7: "Saturday",
    };
    return theDay[day] || "empty";
  };

  return (
    <div>
      <h1 className="title">Wizard Pizza</h1>
      <section className="menu">
        <div className="menuButton" id="makeOrders" onClick={(e) => setPage(0)}>
          ORDERS
        </div>
        <div className="menuButton" id="ready" onClick={(e) => setPage(1)}>
          PICKUP
        </div>
        <div className="menuButton" id="promos" onClick={(e) => setPage(2)}>
          PROMOS
        </div>
        <div className="menuButton" id="hours" onClick={(e) => setPage(3)}>
          HOURS
        </div>
        <div className="menuButton" id="inventory" onClick={(e) => setPage(4)}>
          INVENTORY
        </div>
      </section>
      {page === 0 ? (
        orders.length > 0 &&
        (pizzas.length > 0 || others.length > 0) &&
        Object.keys(orders).map((order, index) => {
          return (
            orders[index]["orderstatus"] < 4 && (
              <div className="orders" key={"orders" + index}>
                <div className="orderBox" key={"orderBox" + index}>
                  <div className="orderTime" key={"orderTime" + index}>
                    {orders[index].scheduledtime !== null &&
                      orders[index].scheduledtime.replace(
                        /(:\d{2}| [AP]M)$/,
                        ""
                      )}
                    <small className="pickupTime"> PICK-UP TIME</small>
                  </div>
                  <div className="orderName" key={"orderName" + index}>
                    {orders[index]["customer_name"]} {orders[index].phone}
                  </div>
                  <div className="orderStatus" key={"orderStatus" + index}>
                    {orderStatus(orders[index].orderstatus)}{" "}
                    <div
                      className="statusButton"
                      id={orders[index]["order_id"]}
                      onClick={(e) => handleOrderStatus(e)}
                      key={"statusButton" + index}
                    >
                      &gt;
                    </div>
                  </div>
                  {pizzas[index] &&
                    Object.entries(pizzas[index]).map(([key, value], i) => {
                      return (
                        <div className="itemBox" key={"itemBox" + i}>
                          <div className="itemName" key={"itemName" + i}>
                            {key}: {value.size}{" "}
                          </div>
                          <div className="itemToppings" key={"itemSauce" + i}>
                            {Object.entries(value.sauce).map(
                              ([key, value], ind) => {
                                return (
                                  <div
                                    className="itemTopping"
                                    key={"sauce" + ind}
                                  >
                                    {key}: {value},
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div className="itemToppings" key={"itemCheese" + i}>
                            {Object.entries(value.cheese).map(
                              ([key, value], ind) => {
                                return (
                                  <div
                                    className="itemTopping"
                                    key={"cheese" + ind}
                                  >
                                    {key}: {value},
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div
                            className="itemToppings"
                            key={"itemToppings" + i}
                          >
                            {Object.entries(value.toppings).map(
                              ([key, value], ind) => {
                                return (
                                  <div
                                    className="itemTopping"
                                    key={"toppings" + ind}
                                  >
                                    {key}: {value},
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {others[index] &&
                    Object.entries(others[index]).map(([key, value], i) => {
                      return (
                        <div className="itemBox" key={"itemBox" + i}>
                          <div className="itemOthersName" key={"itemName" + i}>
                            {value.name}: {value.size}{" "}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          );
        })
      ) : page === 1 ? (
        orders.length > 0 &&
        (pizzas.length > 0 || others.length > 0) &&
        Object.keys(orders).map((order, index) => {
          return (
            orders[index]["orderstatus"] > 3 && (
              <div className="orders" key={"orders" + index}>
                <div className="orderBox" key={"orderBox" + index}>
                  <div className="orderTime" key={"orderTime" + index}>
                    {orders[index].scheduledtime !== null &&
                      orders[index].scheduledtime.replace(
                        /(:\d{2}| [AP]M)$/,
                        ""
                      )}
                    <small className="pickupTime"> PICK-UP TIME</small>
                  </div>
                  <div className="orderNamePickup" key={"orderName" + index}>
                    {orders[index]["customer_name"]} {orders[index].phone}
                  </div>
                  <div className="subtotal" key={"subtotal" + index}>
                    SUB-TOTAL ${orders[index]["subtotal"]}
                  </div>
                  <div className="discount" key={"discount" + index}>
                    DISCOUNT -{orders[index]["discount"]}
                  </div>
                  <div className="tax" key={"tax" + index}>
                    TAX ${orders[index]["tax"]}
                  </div>
                  <div className="total" key={"total" + index}>
                    TOTAL ${orders[index]["total"]}
                  </div>
                  <div className="orderStatus" key={"orderStatus" + index}>
                    {orderStatus(orders[index].orderstatus)}{" "}
                    <div
                      className="statusButton"
                      id={orders[index]["order_id"]}
                      onClick={(e) => handleOrderStatus(e)}
                      key={"statusButton" + index}
                    >
                      &gt;
                    </div>
                  </div>
                  {pizzas[index] &&
                    Object.entries(pizzas[index]).map(([key, value], i) => {
                      return (
                        <div className="itemBox" key={"itemBox" + i}>
                          <div className="itemName" key={"itemName" + i}>
                            {key}: {value.size}{" "}
                          </div>
                          <div className="itemToppings" key={"itemSauce" + i}>
                            {Object.entries(value.sauce).map(
                              ([key, value], ind) => {
                                return (
                                  <div
                                    className="itemTopping"
                                    key={"sauce" + ind}
                                  >
                                    {key}: {value},
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div className="itemToppings" key={"itemCheese" + i}>
                            {Object.entries(value.cheese).map(
                              ([key, value], ind) => {
                                return (
                                  <div
                                    className="itemTopping"
                                    key={"cheese" + ind}
                                  >
                                    {key}: {value},
                                  </div>
                                );
                              }
                            )}
                          </div>
                          <div
                            className="itemToppings"
                            key={"itemToppings" + i}
                          >
                            {Object.entries(value.toppings).map(
                              ([key, value], ind) => {
                                return (
                                  <div
                                    className="itemTopping"
                                    key={"toppings" + ind}
                                  >
                                    {key}: {value},
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {others[index] &&
                    Object.entries(others[index]).map(([key, value], i) => {
                      return (
                        <div className="itemBox" key={"itemBox" + i}>
                          <div className="itemOthersName" key={"itemName" + i}>
                            {value.name}: {value.size}{" "}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )
          );
        })
      ) : page === 2 ? (
        <div className="deals">
          {deals &&
            Object.keys(deals).map((deal, index) => {
              return (
                <div className="orders">
                  <section className="orderBox" key={deal + index}>
                    <div className="orderStatus" key={"promoStatus" + index}>
                      {promoStatus(deals[index]["deal_active"])}{" "}
                      <div
                        className="statusButton"
                        id={deals[index]["deals_id"]}
                        onClick={(e) =>
                          handlePromoStatus(e, deals[index]["deal_active"])
                        }
                        key={"promoButton" + index}
                      >
                        &gt;
                      </div>
                    </div>
                    <h2 className="dealTitle">{deals[deal]["deal_title"]}</h2>
                    <div className="description">
                      {deals[deal]["description"]}
                    </div>
                    <div className="info">
                      DISCOUNT: {deals[deal]["discount"]}, ID#
                      {deals[deal]["deals_id"]}, NAME:{" "}
                      {deals[deal]["deal_name"]}, WEEKDAY:{" "}
                      {weekday(deals[deal]["weekday"])}, TIME:{" "}
                      {deals[deal]["time_in"]}-{deals[deal]["time_out"]}, DATE:{" "}
                      {deals[deal]["date_in"]}-{deals[deal]["date_out"]}
                    </div>
                  </section>
                </div>
              );
            })}
        </div>
      ) : page === 3 ? (
        <div className="hours">
          {hours &&
            Object.keys(hours).map((hour, index) => {
              return (
                <div className="orders">
                  <section className="hoursBox" key={hour + index}>
                    <div className="orderStatus" key={"closedStatus" + index}>
                      {closedStatus(hours[index]["closed"])}{" "}
                      <div
                        className="statusButton"
                        id={hours[index]["hours_id"]}
                        onClick={(e) =>
                          handleClosedStatus(e, hours[index]["closed"])
                        }
                        key={"openCloseButton" + index}
                      >
                        &gt;
                      </div>
                    </div>
                    <h2 className="hourTitle">{hours[hour]["dayOfWeek"]}</h2>
                    <form
                      className="hoursUpdate"
                      onSubmit={(e) => handleUpdateOpenHours(e, hour)}
                    >
                      <label className="inputFieldLabel" for="input">
                        <div className="inventoryName">OPEN</div>{" "}
                        {hours[hour]["openTime"]}{" "}
                      </label>
                      <input
                        type="time"
                        className="changeTime"
                        name="changeTime"
                        placeholder="00:00"
                        onChange={(e) => setChangeOpenTime(e.target.value)}
                      ></input>
                      <input
                        type="submit"
                        className="updateTimeButton"
                        value="UPDATE"
                      />
                    </form>
                    <form
                      className="hoursUpdate"
                      onSubmit={(e) => handleUpdateCloseHours(e, hour)}
                    >
                      <label className="inputFieldLabel" for="input">
                        <div className="inventoryName">CLOSED</div>{" "}
                        {hours[hour]["closeTime"]}{" "}
                      </label>
                      <input
                        type="time"
                        className="changeTime"
                        name="changeTime"
                        placeholder="00:00"
                        onChange={(e) => setChangeCloseTime(e.target.value)}
                      ></input>
                      <input
                        type="submit"
                        className="updateTimeButton"
                        value="UPDATE"
                      />
                    </form>
                    <form
                      className="hoursUpdate"
                      onSubmit={(e) => handleUpdateNoticeHours(e, hour)}
                    >
                      <label className="inputFieldLabel" for="input">
                        <div className="inventoryName">NOTICE</div>{" "}
                        {hours[hour]["closedNotice"]}{" "}
                      </label>
                      <div className="inputAndSubmit">
                        <input
                          type="text"
                          className="changeNotice"
                          name="changeNotice"
                          placeholder="Closure Notice"
                          onChange={(e) => setChangeNoticeHours(e.target.value)}
                        ></input>
                        <input
                          type="submit"
                          className="updateNoticeButton"
                          value="UPDATE"
                        />
                      </div>
                    </form>
                  </section>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="orders">
          {" "}
          <div className="drinks">
            {drinks &&
              Object.keys(drinks).map((index, drink) => {
                return (
                  <form
                    className="drinksUpdate"
                    onSubmit={(e) => handleUpdateDrinks(e, drink)}
                  >
                    <label className="inventoryInfo">
                      <div className="inventoryName">
                        {drinks[drink]["name"]}
                      </div>{" "}
                      {drinks[drink]["size"]} / count:{" "}
                      <div className="inventoryNumber">
                        {drinks[drink]["inventory"]}{" "}
                      </div>
                    </label>
                    <input
                      type="number"
                      className="addToInventory"
                      name="addToInventory"
                      placeholder="+/-"
                      onChange={(e) => setInventoryAddNumber(e.target.value)}
                    ></input>
                    <input
                      type="submit"
                      className="updateInventoryButton"
                      value="SUBMIT"
                    />
                  </form>
                );
              })}
          </div>
          <div className="desserts">
            {desserts &&
              Object.keys(desserts).map((index, dessert) => {
                return (
                  <form
                    className="dessertsUpdate"
                    onSubmit={(e) => handleUpdateDesserts(e, dessert)}
                  >
                    <div className="dessertName">
                      {desserts[dessert]["name"]}
                    </div>
                    <label className="inventoryInfo">
                      {desserts[dessert]["size"]} / count:{" "}
                      <div className="inventoryNumber">
                        {desserts[dessert]["inventory"]}{" "}
                      </div>
                    </label>
                    <input
                      type="number"
                      className="addToInventory"
                      name="addToInventory"
                      placeholder="+/-"
                      onChange={(e) => setInventoryAddNumber(e.target.value)}
                    ></input>
                    <input
                      type="submit"
                      className="updateInventoryButton"
                      value="SUBMIT"
                    />
                  </form>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
