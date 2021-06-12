class VideosController < ApplicationController
    before_action :logged_in_user, only: [:create, :destroy]

    def show
        @video = current_user.videos.find_by(id: params[:id])
    end

    def new
        @video = Video.new
    end

    def create
        @video = current_user.videos.build(video_params)
        if @video.save
            flash[:success] = "Video uploaded!"
        else
            flash[:danger] = "An error occurred"
        end
        redirect_to current_user
    end

    def destroy
    end

    private

        def video_params
            params.require(:video).permit(:title, :description, :file)
        end
end
