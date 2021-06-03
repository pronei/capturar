class StaticPagesController < ApplicationController
  def home
    @video = current_user.videos.build if logged_in?
  end

  def help
  end

  def about
  end

  def contact
  end
end
