require 'open-uri'
require 'nokogiri'
require 'dalli'

# set ENV["TWENTY_THREE_HQ_USERNAME"] and ENV["TWENTY_THREE_HQ_PASSWORD"]
class TwentyThreeHQ
  
  def self.photos
    d = Dalli::Client.new
    p = d.get("photos")
    return p unless p.nil?
    r = Nokogiri::XML(open("http://www.23hq.com/services/rest/?api_key=mydemo&method=people.getPublicPhotos&user_id=#{ENV["TWENTY_THREE_HQ_USERID"]}&per_page=500&extras=url_o&username=#{ENV["TWENTY_THREE_HQ_USERNAME"]}&password=#{ENV["TWENTY_THREE_HQ_PASSWORD"]}")).css("photo").collect{|a| "http://www.23hq.com/23666/#{a.attributes["id"]}_#{a.attributes["secret"]}_large1k.jpg" }
    d.set("photos",r)
    r
  end
  
end