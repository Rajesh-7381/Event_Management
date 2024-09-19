const db = require("../config/db");
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() );

const year = yesterday.getFullYear();
const month = String(yesterday.getMonth() + 1).padStart(2, '0');
const day = String(yesterday.getDate()).padStart(2, '0'); 
const yearDateMonth = `${year}-${month}-${day}`;

// console.log(yearDateMonth);

const bEvent = {
  bookEvent: async (newBookingEvent) => {
    // console.log(newBookingEvent);
    const {  choosenevent,      ticketType,  eventDate,  quantity,  ticket_price,  final_price,  user_id} = newBookingEvent;
    const query = `  INSERT INTO ticketBooks2   (user_id, event_ticket_id, ticketType, eventDate, quantity, ticket_price, total_price)  VALUES (?, ?, ?, ?, ?, ?, ?)    `;
    try {
      const [result] = await db.promise().query(query, [  user_id,  choosenevent,ticketType,   eventDate,  quantity,  ticket_price,  final_price]);
      // console.log(result);
      return result;
    } catch (error) {
      console.error("Error booking event:", error); 
    }
  },
  checkQuantity: async(event_ticket_id)=>{
    const query="SELECT e.event_id AS event_ticket_id, e.ticket_Type, e.quantity AS total_quantity,  IFNULL(SUM(b.quantity), 0) AS total_booked, (e.quantity - IFNULL(SUM(b.quantity), 0)) AS quantity_left FROM EventTickets2 e LEFT JOIN ticketBooks2 b ON e.event_id = b.event_ticket_id WHERE  e.event_id = ? GROUP BY e.event_id, e.ticket_Type, e.quantity"
    try {
      const [rows] = await db.promise().query(query, [event_ticket_id]);
        // console.log(rows)
      return rows
    } catch (error) {
        console.error("Error fetching ticket quantity", error);
    }
  },
  ActiveEvents:async()=>{
    const query="select count(*) as total from Events2 where eventDate=?";
    try {
      const result=await new Promise((resolve,reject)=>{
        db.query(query,[yearDateMonth],(err,results)=>{
          if(err){
            reject(err)
          }
          // console.log(results)
          resolve(results)
        })
      })
      return result[0].total
    } catch (error) {
        console.log(error)
    }
  },
  userbookedOrderStatus: async (email) => {
    // console.log(email);
    const query = `  SELECT tb.id AS order_id, tb.event_ticket_id, tb.ticketType, tb.purchase_date, tb.eventDate, tb.quantity, tb.ticket_price, tb.total_price,
       tb.status AS order_status, u.name AS user_name,  u.email AS user_email,  e.title as events FROM ticketBooks2 tb JOIN Users2 u ON tb.user_id = u.id join Events2 e on tb.event_ticket_id=e.id WHERE u.email = ? order by tb.id desc
    `;
    
    return new Promise((resolve, reject) => {
        db.query(query, [email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                // console.log(result);
                resolve(result);
            }
        });
    });
},
feedback:async (data) => {
  const { event_name, feedback, user_id } = data;
  const query = "INSERT INTO feedback (event_name, feedback, user_id) VALUES (?, ?, ?)";
  try {
      const [result] = await db.promise().query(query, [event_name, feedback, user_id]);
      // console.log(result);
      return result;
  } catch (error) {
      console.error('Error inserting feedback:', error);
      throw error; 
  }
},

fetchfeedback: async () => {
  const query = `SELECT u.email as username, f.event_name as event, f.feedback  FROM Users2 as u    JOIN feedback as f ON f.user_id = u.id `;
  return new Promise((resolve, reject) => {
      db.query(query, (err, data) => {
          if (err) {
              reject(err);
          } else {
              resolve(data); 
          }
      });
  });
}


};

module.exports = bEvent;
