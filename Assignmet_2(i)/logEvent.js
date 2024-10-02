import fs from 'fs';
import { v4 as uuid } from 'uuid';
import { format } from 'date-fns';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define log directory
const logDirectory = path.join(__dirname, 'logs');

// Define the logging function 
const logEvents = async (message) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logItem = `${dateTime} \t ${uuid()} \t ${message}\n`;

    try {
        // Create the directory if it doesn't exist
        if (!fs.existsSync(logDirectory)) {
            await fs.promises.mkdir(logDirectory);
        }

        // Append log to eventLogs.txt
        const logFilePath = path.join(logDirectory, 'eventLogs.txt');
        await fs.promises.appendFile(logFilePath, logItem); 
        console.log(`Logged: ${logItem}`);
    } catch (err) {
        console.error('Error logging event:', err);
    }
};

// Export the logEvents function
export default logEvents;