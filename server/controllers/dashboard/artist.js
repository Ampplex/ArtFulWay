const Artist = require('../../models/artist');
const { Projects } = require("../../models/client");

const getMatchedProjects = async (req, res) => {
    const { artist_id } = req.query;
    console.log(artist_id);

    if (!artist_id) {
        return res.status(400).json({ error: "Artist ID is required" });
    }

    /*
          setTimeout(() => {
        if (role === "client") {
          navigate("/client_dashboard");
        } else {
          navigate("/artist_dashboard");
        }
      }, 1000);
    */

    try {
        const artist = await Artist.findById(artist_id);
        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }
        const matchedProjects = [] // Stores match projects response list object [{}] format
        const matchedProjectsIds = artist.matched_project_ids; // Stores matched project ids which is in the list format
        console.log(matchedProjectsIds);

        for (let i = 0; i < matchedProjectsIds.length; i++) {
            const project = await Projects.findById(matchedProjectsIds[i]);
            if (project) {
                matchedProjects.push(project);
            }
        }
        console.log(matchedProjects);
        return res.status(200).json({ matchedProjects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Server error" });
    }
}

module.exports = {
    getMatchedProjects
}