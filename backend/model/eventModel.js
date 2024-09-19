const db = require("../config/db");
const today=new Date();
    // const yearDateMonth=today.getFullYear()+'-'+today.getMonth()+'-'+today.getDate()
const yearDateMonth=today.toISOString().split('T')[0];
// console.log(yearDateMonth)

const event = {
    getALL: async () => {
        const query = ` SELECT  e.id, e.title, e.description, e.eventDate, e.eventTime, e.location, et.general_ticket_price, et.vip_ticket_price, et.quantity     FROM Events2 e     JOIN EventTickets2 et ON et.event_id = e.id`;

        return new Promise((resolve, reject) => {
            db.query(query, (err, data) => {
                if (err) {
                    return reject(err); 
                }
                // const eventdata = data.map(item => ({ 
                //     ...item,
                //     eventDate: item.eventDate.toISOString().slice(0, 10), 
                // }));
                // console.log(eventdata)
                resolve(data); 
            });
        });
    },
    edit:async(id)=>{
        const query="SELECT e.title, e.privacy,e.event_image, e.description, e.eventDate, e.eventTime, e.location,e.organizer_id, et.general_ticket_price, et.vip_ticket_price, et.quantity FROM Events2 e JOIN EventTickets2 et ON et.event_id=e.id WHERE e.id=?";
        return new Promise((resolve,reject)=>{
            db.query(query,[id],(err,data)=>{
                if(err){
                    reject(err)
                }                    
                resolve(data)
            })
        })
    },
    upComing: async () => {
        
        const query = ` SELECT e.id, e.title, e.privacy, e.description, e.eventDate, e.eventTime, e.location, e.organizer_id, et.general_ticket_price, et.vip_ticket_price, et.quantity     FROM Events2 as e     JOIN EventTickets2 et ON et.event_id = e.id     WHERE eventDate >= ?     LIMIT 5`;
    
        return new Promise((resolve, reject) => {
            db.query(query, [yearDateMonth], (err, data) => {
                if (err) {
                    reject(err);
                }

                resolve(data);
            });
        });
    },
    
    lastFive:async()=>{
        const query=" SELECT e.id, e.title, e.privacy, e.description, e.eventDate, e.eventTime, e.location, e.organizer_id, et.general_ticket_price, et.vip_ticket_price, et.quantity     FROM Events2 as e     JOIN EventTickets2 et ON et.event_id = e.id     WHERE eventDate <= ?     LIMIT 5 ";
        return new Promise((resolve,reject)=>{
            db.query(query,[yearDateMonth],(err,data)=>{
                if(err){
                    reject(err)
                }

                resolve(data)
            })
        })
    },
    DeleteEvent:async (id) => {
        const deleteEventQuery = "DELETE FROM Events2 WHERE id = ?";
        const deleteEventTicketsQuery = "DELETE FROM EventTickets2 WHERE event_id = ?";
        
        return new Promise((resolve, reject) => {
          
          db.query(deleteEventTicketsQuery, [id], (err, result) => {
            if (err) {
              reject(err);
            } else {
              
              db.query(deleteEventQuery, [id], (err, result) => {
                if (err) {
                  reject(err);
                } else {
                  resolve({ message: "Event and its tickets deleted successfully." });
                }
              });
            }
          });
        });
      }     
    
};

module.exports = event;
