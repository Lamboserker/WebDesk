// export const useWebSocket = (url) => {
//   const socket = useRef(null);
//   useEffect(() => {
//     socket.current = io(url);
//     socket.current.on("connect", () => {
//       console.log("Connected to the server");
//     });

//     // Hier können Sie weitere Event-Listener hinzufügen

//     return () => {
//       socket.current.disconnect();
//     };
//   }, [url]);

//   return socket;
// };
