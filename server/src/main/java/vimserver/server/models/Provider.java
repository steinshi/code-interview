package vimserver.server.models;

public class Provider implements Comparable {
    private String name;
    private Double score;
    private String[] specialties;
    private AvailableDate[] availableDates;

    public Provider() {}

    public Provider(String name, Double score, String[] specialties, AvailableDate[] availableDates) {
        this.name = name;
        this.score = score;
        this.specialties = specialties;
        this.availableDates = availableDates;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String[] getSpecialties() {
        return specialties;
    }

    public void setSpecialties(String[] specialties) {
        this.specialties = specialties;
    }

    public AvailableDate[] getAvailableDates() {
        return availableDates;
    }

    public void setAvailableDates(AvailableDate[] availableDates) {
        this.availableDates = availableDates;
    }

    @Override
    public int compareTo(Object o) {
        if (this.getScore() <= ((Provider)o).getScore())
            return 1;
        else
            return -1;
    }
}
