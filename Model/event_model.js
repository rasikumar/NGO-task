const db = require("../DB/db_connection");


const Event = {

    createEvent: (eventData, callback) => {
        const { name, date_time, venue, description, image } = eventData;
        const status = "open";

        const sql = `INSERT INTO events (name, date_time, venue, description, image, status, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, NOW())`;

        db.query(sql, [name, date_time, venue, description, image, status], callback);
    },

    updateEventStatus: () => {
        const sql = `
             UPDATE events 
            SET status = 
                CASE 
                    WHEN NOW() < date_time THEN 'open'  
                    WHEN NOW() BETWEEN date_time AND DATE_ADD(date_time, INTERVAL 8 HOUR) THEN 'ongoing'  
                    WHEN NOW() > DATE_ADD(date_time, INTERVAL 8 HOUR) THEN 'closed'  
                    ELSE status  
                END
            WHERE status != 'closed';
        `;
    
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Error updating event statuses:", err);
            } else {
                console.log("Event statuses updated successfully:", result.affectedRows);
            }
        });
    },
    
   
// Fetch all events with pagination (sorted by latest created events first)
getAllEvents: (limit, offset, callback) => {
    db.query(
        "SELECT * FROM events ORDER BY created_at DESC LIMIT ? OFFSET ?",
        [limit, offset],
        callback
    );
},


// Get the total number of events
getTotalEventsCount: (callback) => {
    db.query("SELECT COUNT(*) AS total FROM events", callback);
},
    
    
    


    // getAllEvents: (callback) => {
    //     db.query("SELECT * FROM events", callback);
    // },

    getEventById: (id, callback) => {
        db.query("SELECT * FROM events WHERE id = ?", [id], callback);
    },

    


    updateEvent: (id, eventData, callback) => {
        const { name, date_time, venue, description, image, status } = eventData;
        // console.log("model",eventData);
        const sql = "UPDATE events SET name=?, date_time=?, venue=?, description=?, image=?, status=? WHERE id=?";
        db.query(sql, [name, date_time, venue, description, image, status, id], callback);
    },

    deleteEvent: (id, callback) => {
        db.query("DELETE FROM events WHERE id = ?", [id], callback);
    },


    
};




module.exports = Event;
