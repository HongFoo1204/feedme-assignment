"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import type { Bot } from "@/interfaces/Bot";
import type { Order, OrderType } from "@/interfaces/Order";

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [bots, setBots] = useState<Bot[]>([]);
  const [orderNumber, setOrderNumber] = useState(1);
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const pendingVIPOrders = pendingOrders.filter(
    (order) => order.type === "VIP"
  );
  const pendingNormalOrders = pendingOrders.filter(
    (order) => order.type === "Normal"
  );
  const displayOrders = orders
    .filter(
      (order) => order.status === "PENDING" || order.status === "PROCESSING"
    )
    .sort((a, b) => {
      if (a.type === "VIP" && b.type === "Normal") {
        return -1; // VIP orders should come first
      } else if (a.type === "Normal" && b.type === "VIP") {
        return 1; // Normal orders should come after VIP orders
      } else {
        return 0; // Keep the existing order if types are the same
      }
    });
  const completedOrders = orders.filter(
    (order) => order.status === "COMPLETED"
  );

  useEffect(() => {
    // No order
    if (pendingOrders.length === 0) return;
    // No bot
    if (bots.length === 0) return;
    // No bot available
    const newBots = [...bots];
    const selectedBotIndex = newBots.findIndex((bot) => bot.status === "IDLE");
    const selectedBot = bots[selectedBotIndex];
    if (!selectedBot) return;

    /**
     * The function `botProcessing` updates the status of an order and a bot, simulates a 10-second
     * processing time, and then updates the status of the bot and the order again.
     * @param {number} orderToProcessIndex - The `orderToProcessIndex` parameter is the index of the
     * order that needs to be processed. It is used to retrieve the order from the `orders` array and
     * update its status.
     */
    const botProcessing = (orderToProcessIndex: number) => {
      // Update order status
      const newOrders = [...orders];
      const orderToProcess = newOrders[orderToProcessIndex];
      orderToProcess.status = "PROCESSING";
      newOrders.splice(orderToProcessIndex, 1, orderToProcess);
      setOrders([...newOrders]);
      // Update bot status
      selectedBot.status = "BUSY";
      selectedBot.order = orderToProcess;
      newBots.splice(selectedBotIndex, 1, selectedBot);
      setBots([...newBots]);

      // Simulate 10sec bot
      setTimeout(() => {
        // After 10sec processing time
        // Set bot back to idle
        setBots((currentBots) => {
          const newBots = [...currentBots];
          selectedBot.status = "IDLE";
          selectedBot.order = undefined;
          newBots.splice(selectedBotIndex, 1, selectedBot);
          return [...newBots];
        });
        // Set order status to completed
        setOrders((currentOrders) => {
          const newOrders = [...currentOrders];
          const orderToProcess = newOrders[orderToProcessIndex];
          orderToProcess.status = "COMPLETED";
          newOrders.splice(orderToProcessIndex, 1, orderToProcess);
          return [...newOrders];
        });
      }, 10000);
    };

    // Process order
    if (pendingOrders.length > 0) {
      if (pendingVIPOrders.length > 0) {
        // Process VIP Order First
        const orderToProcess = orders.findIndex(
          (order) => order.id === pendingVIPOrders[0].id
        );
        if (orderToProcess >= 0) {
          botProcessing(orderToProcess);
        }
      } else {
        // Process Normal Order IF there is no VIP Order
        const orderToProcess = orders.findIndex(
          (order) => order.id === pendingNormalOrders[0].id
        );
        if (orderToProcess >= 0) {
          botProcessing(orderToProcess);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, bots]);

  const addNewOrder = (type: OrderType) => {
    const newOrder: Order = {
      id: orderNumber.toString(),
      type: type,
      status: "PENDING",
    };
    setOrders([...orders, newOrder]);
    setOrderNumber(orderNumber + 1);
  };

  const handleNewNormalOrder = () => {
    addNewOrder("Normal");
  };

  const handleNewVIPOrder = () => {
    addNewOrder("VIP");
  };

  const handleAddBot = () => {
    const newBot: Bot = { id: (bots.length + 1).toString(), status: "IDLE" };
    setBots([...bots, newBot]);
  };

  const handleRemoveBot = () => {
    if (bots.length === 0) return;
    const updatedBots = [...bots];
    const botToRemove = updatedBots.pop();
    setBots(updatedBots);

    // If the bot is processing an order, move it back to PENDING
    const newOrders = [...orders];
    const processingOrder = newOrders.find(
      (order) => order.id === botToRemove?.order?.id
    );
    if (processingOrder) {
      processingOrder.status = "PENDING";
      setOrders(newOrders);
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <h1 className='text-xl font-bold'>McDonald Order Controller</h1>
      <div className='min-w-full grid grid-cols-4 md:grid-cols-12 gap-4 justify-evenly items-center'>
        <Card className='col-span-4 h-[50vh]'>
          <CardHeader className='flex gap-3'>Pending Area</CardHeader>
          <Divider />
          <CardBody>
            {displayOrders.map((e) => {
              return (
                <p key={`order-${e.id}`} color='black'>
                  {`Order No.${e.id}`} - {e.type} - {e.status}
                </p>
              );
            })}
          </CardBody>
        </Card>
        <Card className='col-span-4 h-[50vh]'>
          <CardHeader className='flex gap-3'>Bots Area</CardHeader>
          <Divider />
          <CardBody>
            {bots.map((e) => {
              return (
                <p key={`bot-${e.id}`} color='black'>
                  {`Bot ${e.id}`} - {e.status}
                  {e.order && ` - Processing: Order No.${e.order.id}`}
                </p>
              );
            })}
          </CardBody>
        </Card>
        <Card className='col-span-4 h-[50vh]'>
          <CardHeader className='flex gap-3'>Completed Area</CardHeader>
          <Divider />
          <CardBody>
            {completedOrders.map((e) => {
              return (
                <p key={`order-${e.id}`} color='black'>
                  {`Order No.${e.id}`} - {e.type} - {e.status}
                </p>
              );
            })}
          </CardBody>
        </Card>
      </div>
      <Divider className='bg-black my-2' />
      <div className='mb-32 flex flex-wrap justify-center place-items-center gap-2 text-center md:max-w-5xl md:w-full md:mb-0 md:text-left'>
        <Button onClick={handleNewNormalOrder}>New Normal Order</Button>
        <Button onClick={handleNewVIPOrder}>New VIP Order</Button>
        <Button onClick={handleAddBot}>+ Bot</Button>
        <Button onClick={handleRemoveBot}>- Bot</Button>
      </div>
    </main>
  );
}
