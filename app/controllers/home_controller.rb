class HomeController < ApplicationController
  def index
    if user_signed_in?
      render layout:"chat"
    else
      authenticate_user!
    end
  end
end
