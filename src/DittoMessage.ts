import moment from "moment";

type Direction = "d2t" | "t2d";

/** Message object to store cross-platform metadata */
export class DittoMessage {
    private _direction: string;
	private _discordMessageId: string;
    private _telegramMessageId: string;

    private _messageText: string | null;

    private _pinned: boolean;
    private _reactions: Set<string>;

    private _referencedMessage: DittoMessage | null;

    /**
	 * Creates a new Message object
	 *
	 * @param direction One of the two direction constants of this class
	 * @param discordMessageId Message ID in Discord
	 * @param telegramMessageId	Message ID in Telegram
     * @param messageText displayed content of message
	 */
	constructor(direction: Direction, discordMessageId: string, telegramMessageId: string, messageText: string | null, referencedMessage: DittoMessage | null) {
		/** The message itself */
		this._reactions = new Set();
        this._pinned = false;

        this._direction = direction;
        this._discordMessageId = discordMessageId;
        this._telegramMessageId = telegramMessageId;

        this._messageText = messageText;
        this._referencedMessage = referencedMessage;

        console.log(this);
	}


    get pinned(): boolean {
        return this._pinned;
    }

    set pinned(isPinned: boolean) {
        this._pinned = isPinned;
    }

    get discordMessageId(): string {
        return this._discordMessageId;
    }

    get telegramMessageId(): string {
        return this._telegramMessageId;
    }

    get referencedMessage(): DittoMessage | null {
        return this._referencedMessage;
    }

    set messageText(newMessage: string) {
        this._messageText = newMessage;
    }
}
