package vimserver.server.models;

public class AvailableDate {
    private Long from;
    private Long to;

    public AvailableDate() {}

    public AvailableDate(Long from, Long to) {
        this.from = from;
        this.to = to;
    }

    public Long getFrom() {
        return from;
    }

    public void setFrom(Long from) {
        this.from = from;
    }

    public Long getTo() {
        return to;
    }

    public void setTo(Long to) {
        this.to = to;
    }
}
